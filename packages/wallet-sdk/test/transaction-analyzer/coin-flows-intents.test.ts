// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect } from 'vitest';
import { fromHex, toBase58, toHex } from '@haneullabs/bcs';
import { Inputs, Transaction } from '@haneullabs/haneul/transactions';
import { normalizeStructTag, normalizeHaneulAddress } from '@haneullabs/haneul/utils';
import { analyze } from '../../src/transaction-analyzer/analyzer.js';
import { balanceFlows } from '../../src/transaction-analyzer/rules/balance-flows.js';
import { coinFlows } from '../../src/transaction-analyzer/rules/coin-flows.js';
import { coins } from '../../src/transaction-analyzer/rules/coins.js';
import { MockHaneulClient } from '../mocks/MockHaneulClient.js';
import { DEFAULT_SENDER, TEST_COIN_1_ID } from '../mocks/mockData.js';

const HANEUL = '0x0000000000000000000000000000000000000000000000000000000000000002::haneul::HANEUL';
const USDC = '0x0000000000000000000000000000000000000000000000000000000000000a0b::usdc::USDC';

describe('Coin Flows - tx.coin() / tx.balance() Integration', () => {
	// Helper to resolve intents and analyze in one step.
	// toJSON({ client }) runs prepareForSerialization which resolves CoinWithBalance intents.
	async function analyzeWithIntents(tx: Transaction, client: MockHaneulClient) {
		const json = await tx.toJSON({ client });
		return analyze({ coinFlows }, { client, transaction: json });
	}

	// --- tx.coin() with HANEUL ---

	it('tx.coin() HANEUL from gas coin (coins only, no AB)', async () => {
		const client = new MockHaneulClient();
		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);

		const coin = tx.coin({ balance: 1_000_000_000n }); // 1 HANEUL from gas
		tx.transferObjects([coin], tx.pure.address('0x456'));

		const results = await analyzeWithIntents(tx, client);

		const haneulFlow = results.coinFlows.result?.outflows.find((f) => f.coinType === HANEUL);
		// 1 HANEUL transferred + gas budget
		expect(haneulFlow).toBeDefined();
		expect(haneulFlow!.amount).toBeGreaterThanOrEqual(1_000_000_000n);
	});

	it('tx.coin() HANEUL from gas coin, transfer to self (no outflow beyond gas)', async () => {
		const client = new MockHaneulClient();
		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);

		const coin = tx.coin({ balance: 500_000_000n });
		tx.transferObjects([coin], tx.pure.address(DEFAULT_SENDER));

		const results = await analyzeWithIntents(tx, client);

		const haneulFlow = results.coinFlows.result?.outflows.find((f) => f.coinType === HANEUL);
		expect(haneulFlow).toBeDefined();
		// Only gas budget should be the outflow (split returned to self)
		expect(haneulFlow!.amount).toBeLessThan(500_000_000n);
	});

	// --- tx.coin() with non-HANEUL ---

	it('tx.coin() non-HANEUL from coins only (no AB)', async () => {
		const client = new MockHaneulClient();
		// Default mock has 1000 USDC in coins, 0 AB
		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);

		const coin = tx.coin({ type: '0xa0b::usdc::USDC', balance: 200_000_000n });
		tx.transferObjects([coin], tx.pure.address('0x456'));

		const results = await analyzeWithIntents(tx, client);

		const usdcFlow = results.coinFlows.result?.outflows.find((f) => f.coinType === USDC);
		expect(usdcFlow).toBeDefined();
		expect(usdcFlow!.amount).toBe(200_000_000n);
	});

	it('tx.coin() non-HANEUL from AB only (no coins)', async () => {
		// Use a token type that has no default coin objects, only AB
		const freshClient = new MockHaneulClient();
		freshClient.setAddressBalance(DEFAULT_SENDER, '0xa0b::usdc::USDC', 500_000_000n);
		// Remove default USDC coins by creating a client that only has HANEUL coins
		// Actually the default mock already has USDC coins. Let's test with a type that has no coins.
		freshClient.setAddressBalance(DEFAULT_SENDER, '0xfff::token::TOKEN', 500_000_000n);

		// Register the token type function for the moveFunctions analyzer
		freshClient.addMoveFunction({
			packageId: '0x999',
			moduleName: 'test',
			name: 'use_token',
			visibility: 'public',
			isEntry: false,
			parameters: [
				{
					reference: null,
					body: {
						$kind: 'datatype',
						datatype: {
							typeName: '0x2::coin::Coin',
							typeParameters: [{ $kind: 'typeParameter', index: 0 }],
						},
					},
				},
			],
		});

		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);

		const coin = tx.coin({ type: '0xfff::token::TOKEN', balance: 200_000_000n, useGasCoin: false });
		tx.transferObjects([coin], tx.pure.address('0x456'));

		const results = await analyzeWithIntents(tx, freshClient);

		const tokenType = normalizeStructTag('0xfff::token::TOKEN');
		const tokenFlow = results.coinFlows.result?.outflows.find((f) => f.coinType === tokenType);
		expect(tokenFlow).toBeDefined();
		expect(tokenFlow!.amount).toBe(200_000_000n);
	});

	it('tx.coin() non-HANEUL from coins + AB combined', async () => {
		const client = new MockHaneulClient();
		// Default mock has 1000 USDC in coins. Add 500 USDC AB.
		client.setAddressBalance(DEFAULT_SENDER, '0xa0b::usdc::USDC', 500_000_000n);

		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);

		// Request more than coins alone can provide (1000 USDC coins + 500 AB = 1500 total)
		const coin = tx.coin({ type: '0xa0b::usdc::USDC', balance: 1_200_000_000n });
		tx.transferObjects([coin], tx.pure.address('0x456'));

		const results = await analyzeWithIntents(tx, client);

		const usdcFlow = results.coinFlows.result?.outflows.find((f) => f.coinType === USDC);
		expect(usdcFlow).toBeDefined();
		expect(usdcFlow!.amount).toBe(1_200_000_000n);
	});

	// --- tx.balance() with HANEUL ---

	it('tx.balance() HANEUL from gas coin', async () => {
		const client = new MockHaneulClient();
		client.setAddressBalance(DEFAULT_SENDER, '0x2::haneul::HANEUL', 2_000_000_000n);

		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);

		const balance = tx.balance({ balance: 500_000_000n });
		// Use the balance in a MoveCall
		tx.moveCall({
			target: '0x999::test::consume_coin',
			typeArguments: [normalizeStructTag('0x2::haneul::HANEUL')],
			arguments: [balance, balance],
		});

		const results = await analyzeWithIntents(tx, client);

		const haneulFlow = results.coinFlows.result?.outflows.find((f) => f.coinType === HANEUL);
		expect(haneulFlow).toBeDefined();
		expect(haneulFlow!.amount).toBeGreaterThanOrEqual(500_000_000n);
	});

	// --- tx.balance() with non-HANEUL ---

	it('tx.balance() non-HANEUL from AB only (Path 1 - direct withdrawal)', async () => {
		const client = new MockHaneulClient();
		// Set up enough AB so Path 1 (all-balance + AB sufficient) is used
		client.setAddressBalance(DEFAULT_SENDER, '0xa0b::usdc::USDC', 1_000_000_000n);

		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);

		const balance = tx.balance({ type: '0xa0b::usdc::USDC', balance: 300_000_000n });
		tx.moveCall({
			target: '0x999::test::consume_coin',
			typeArguments: [normalizeStructTag('0xa0b::usdc::USDC')],
			arguments: [balance, balance],
		});

		const results = await analyzeWithIntents(tx, client);

		const usdcFlow = results.coinFlows.result?.outflows.find((f) => f.coinType === USDC);
		expect(usdcFlow).toBeDefined();
		expect(usdcFlow!.amount).toBe(300_000_000n);
	});

	it('tx.balance() non-HANEUL from coins only (Path 2 - merge and split)', async () => {
		const client = new MockHaneulClient();
		// Default: 1000 USDC in coins, 0 AB -> Path 2

		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);

		const balance = tx.balance({ type: '0xa0b::usdc::USDC', balance: 300_000_000n });
		tx.moveCall({
			target: '0x999::test::consume_coin',
			typeArguments: [normalizeStructTag('0xa0b::usdc::USDC')],
			arguments: [balance, balance],
		});

		const results = await analyzeWithIntents(tx, client);

		const usdcFlow = results.coinFlows.result?.outflows.find((f) => f.coinType === USDC);
		expect(usdcFlow).toBeDefined();
		expect(usdcFlow!.amount).toBe(300_000_000n);
	});

	it('tx.balance() non-HANEUL from coins + AB (Path 2 with AB top-up)', async () => {
		const client = new MockHaneulClient();
		// 1000 USDC in coins + 500 AB. Request more than coins alone.
		client.setAddressBalance(DEFAULT_SENDER, '0xa0b::usdc::USDC', 500_000_000n);

		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);

		const balance = tx.balance({ type: '0xa0b::usdc::USDC', balance: 1_200_000_000n });
		tx.moveCall({
			target: '0x999::test::consume_coin',
			typeArguments: [normalizeStructTag('0xa0b::usdc::USDC')],
			arguments: [balance, balance],
		});

		const results = await analyzeWithIntents(tx, client);

		const usdcFlow = results.coinFlows.result?.outflows.find((f) => f.coinType === USDC);
		expect(usdcFlow).toBeDefined();
		expect(usdcFlow!.amount).toBe(1_200_000_000n);
	});

	// --- Mixed tx.coin() + tx.balance() ---

	it('tx.coin() + tx.balance() same non-HANEUL type', async () => {
		const client = new MockHaneulClient();
		client.setAddressBalance(DEFAULT_SENDER, '0xa0b::usdc::USDC', 500_000_000n);

		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);

		const coin = tx.coin({ type: '0xa0b::usdc::USDC', balance: 100_000_000n });
		const balance = tx.balance({ type: '0xa0b::usdc::USDC', balance: 200_000_000n });

		tx.transferObjects([coin], tx.pure.address('0x456'));
		tx.moveCall({
			target: '0x999::test::consume_coin',
			typeArguments: [normalizeStructTag('0xa0b::usdc::USDC')],
			arguments: [balance, balance],
		});

		const results = await analyzeWithIntents(tx, client);

		const usdcFlow = results.coinFlows.result?.outflows.find((f) => f.coinType === USDC);
		expect(usdcFlow).toBeDefined();
		expect(usdcFlow!.amount).toBe(300_000_000n); // 100 + 200
	});

	it('tx.coin() HANEUL + tx.balance() non-HANEUL in same transaction', async () => {
		const client = new MockHaneulClient();
		client.setAddressBalance(DEFAULT_SENDER, '0xa0b::usdc::USDC', 500_000_000n);

		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);

		const haneulCoin = tx.coin({ balance: 1_000_000_000n });
		const usdcBalance = tx.balance({ type: '0xa0b::usdc::USDC', balance: 200_000_000n });

		tx.transferObjects([haneulCoin], tx.pure.address('0x456'));
		tx.moveCall({
			target: '0x999::test::consume_coin',
			typeArguments: [normalizeStructTag('0xa0b::usdc::USDC')],
			arguments: [usdcBalance, usdcBalance],
		});

		const results = await analyzeWithIntents(tx, client);

		const haneulFlow = results.coinFlows.result?.outflows.find((f) => f.coinType === HANEUL);
		expect(haneulFlow).toBeDefined();
		expect(haneulFlow!.amount).toBeGreaterThanOrEqual(1_000_000_000n);

		const usdcFlow = results.coinFlows.result?.outflows.find((f) => f.coinType === USDC);
		expect(usdcFlow).toBeDefined();
		expect(usdcFlow!.amount).toBe(200_000_000n);
	});

	it('multiple tx.coin() same non-HANEUL type', async () => {
		const client = new MockHaneulClient();

		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);

		// 3 coins of 100 USDC each (default has 1000 USDC total)
		const coin1 = tx.coin({ type: '0xa0b::usdc::USDC', balance: 100_000_000n });
		const coin2 = tx.coin({ type: '0xa0b::usdc::USDC', balance: 100_000_000n });
		const coin3 = tx.coin({ type: '0xa0b::usdc::USDC', balance: 100_000_000n });

		tx.transferObjects([coin1, coin2, coin3], tx.pure.address('0x456'));

		const results = await analyzeWithIntents(tx, client);

		const usdcFlow = results.coinFlows.result?.outflows.find((f) => f.coinType === USDC);
		expect(usdcFlow).toBeDefined();
		expect(usdcFlow!.amount).toBe(300_000_000n);
	});

	it('multiple tx.balance() same non-HANEUL type from AB (Path 1)', async () => {
		const client = new MockHaneulClient();
		client.setAddressBalance(DEFAULT_SENDER, '0xa0b::usdc::USDC', 1_000_000_000n);

		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);

		const b1 = tx.balance({ type: '0xa0b::usdc::USDC', balance: 100_000_000n });
		const b2 = tx.balance({ type: '0xa0b::usdc::USDC', balance: 150_000_000n });

		tx.moveCall({
			target: '0x999::test::consume_coin',
			typeArguments: [normalizeStructTag('0xa0b::usdc::USDC')],
			arguments: [b1, b2],
		});

		const results = await analyzeWithIntents(tx, client);

		const usdcFlow = results.coinFlows.result?.outflows.find((f) => f.coinType === USDC);
		expect(usdcFlow).toBeDefined();
		expect(usdcFlow!.amount).toBe(250_000_000n);
	});

	// --- Zero balance ---

	it('tx.coin() with zero balance', async () => {
		const client = new MockHaneulClient();
		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);

		const coin = tx.coin({ type: '0xa0b::usdc::USDC', balance: 0n });
		tx.transferObjects([coin], tx.pure.address('0x456'));

		const results = await analyzeWithIntents(tx, client);

		// No USDC outflow for zero balance
		const usdcFlow = results.coinFlows.result?.outflows.find((f) => f.coinType === USDC);
		expect(usdcFlow).toBeUndefined();
	});

	it('tx.balance() with zero balance', async () => {
		const client = new MockHaneulClient();
		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);

		const balance = tx.balance({ type: '0xa0b::usdc::USDC', balance: 0n });
		tx.moveCall({
			target: '0x999::test::consume_coin',
			typeArguments: [normalizeStructTag('0xa0b::usdc::USDC')],
			arguments: [balance, balance],
		});

		const results = await analyzeWithIntents(tx, client);

		const usdcFlow = results.coinFlows.result?.outflows.find((f) => f.coinType === USDC);
		expect(usdcFlow).toBeUndefined();
	});
});

// Helper to create a synthetic coin reservation digest
function createSyntheticDigest(balance: bigint): string {
	const digestBytes = new Uint8Array(32);
	const view = new DataView(digestBytes.buffer);
	// Bytes 0-7: reserved balance as LE u64
	view.setBigUint64(0, balance, true);
	// Bytes 8-11: epoch_id as LE u32
	view.setUint32(8, 1, true);
	// Bytes 12-31: magic bytes (0xac repeated)
	for (let i = 12; i < 32; i++) digestBytes[i] = 0xac;
	return toBase58(digestBytes);
}

describe('Coin Flows - Gas Payment and Synthetic Coins', () => {
	it('empty gas payment still counts gas budget as outflow', async () => {
		const client = new MockHaneulClient();
		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);
		tx.setGasPayment([]);
		tx.setGasBudget(10_000_000n);

		// No commands -- just an empty transaction with [] gas payment
		const json = JSON.parse(await tx.toJSON());
		// Ensure gas payment is empty
		json.gasData.payment = [];

		const results = await analyze({ coinFlows }, { client, transaction: JSON.stringify(json) });

		const haneulFlow = results.coinFlows.result?.outflows.find((f) => f.coinType === HANEUL);
		expect(haneulFlow).toBeDefined();
		expect(haneulFlow!.amount).toBe(10_000_000n); // Gas budget is the outflow
	});

	it('synthetic coin reservation ref balance is parsed from digest', async () => {
		const client = new MockHaneulClient();
		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);

		// Split 2 HANEUL from gas and transfer out
		const [split] = tx.splitCoins(tx.gas, [2_000_000_000n]);
		tx.transferObjects([split], tx.pure.address('0x456'));

		const json = JSON.parse(await tx.toJSON());

		// Replace gas payment with a synthetic coin reservation (5 HANEUL reserved from AB)
		// plus a real coin
		const syntheticDigest = createSyntheticDigest(5_000_000_000n);
		json.gasData.payment = [
			{
				objectId: '0x' + 'ab'.repeat(32),
				version: '0',
				digest: syntheticDigest,
			},
		];

		const results = await analyze({ coinFlows }, { client, transaction: JSON.stringify(json) });

		const haneulFlow = results.coinFlows.result?.outflows.find((f) => f.coinType === HANEUL);
		expect(haneulFlow).toBeDefined();
		// Gas initial = 5 HANEUL (synthetic), split 2 HANEUL, gas budget ~10M
		// Outflow = 2 HANEUL + gas budget
		expect(haneulFlow!.amount).toBe(2_010_000_000n);
	});

	it('synthetic coin + real coin in gas payment combines balances', async () => {
		const client = new MockHaneulClient();
		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);

		// Split 3 HANEUL from gas
		const [split] = tx.splitCoins(tx.gas, [3_000_000_000n]);
		tx.transferObjects([split], tx.pure.address('0x456'));

		const json = JSON.parse(await tx.toJSON());

		// Synthetic coin with 2 HANEUL AB reservation + real gas coin (TEST_COIN_1_ID = 5 HANEUL)
		const syntheticDigest = createSyntheticDigest(2_000_000_000n);
		json.gasData.payment = [
			{
				objectId: '0x' + 'ab'.repeat(32),
				version: '0',
				digest: syntheticDigest,
			},
			{
				objectId: TEST_COIN_1_ID,
				version: '100',
				digest: '11111111111111111111111111111111',
			},
		];

		const results = await analyze({ coinFlows }, { client, transaction: JSON.stringify(json) });

		const haneulFlow = results.coinFlows.result?.outflows.find((f) => f.coinType === HANEUL);
		expect(haneulFlow).toBeDefined();
		// Gas initial = 2 HANEUL (synthetic) + 5 HANEUL (real coin) = 7 HANEUL
		// Split 3 HANEUL + gas budget 10M
		expect(haneulFlow!.amount).toBe(3_010_000_000n);
	});

	it('gas coin splits tracked correctly with synthetic coin providing AB', async () => {
		const client = new MockHaneulClient();
		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);

		// Split from gas and send to self -- should only be gas budget outflow
		const [split] = tx.splitCoins(tx.gas, [1_000_000_000n]);
		tx.transferObjects([split], tx.pure.address(DEFAULT_SENDER));

		const json = JSON.parse(await tx.toJSON());

		// Set up synthetic coin with enough balance
		const syntheticDigest = createSyntheticDigest(3_000_000_000n);
		json.gasData.payment = [
			{
				objectId: '0x' + 'ab'.repeat(32),
				version: '0',
				digest: syntheticDigest,
			},
		];

		const results = await analyze({ coinFlows }, { client, transaction: JSON.stringify(json) });

		const haneulFlow = results.coinFlows.result?.outflows.find((f) => f.coinType === HANEUL);
		expect(haneulFlow).toBeDefined();
		// Split returned to self, so only gas budget
		expect(haneulFlow!.amount).toBe(10_000_000n);
	});

	it('exposes gas payment reservations as coin entries with isCoinReservation = true', async () => {
		const client = new MockHaneulClient();
		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);

		const json = JSON.parse(await tx.toJSON());
		const reservationObjectId = '0x' + 'ab'.repeat(32);
		json.gasData.payment = [
			{
				objectId: reservationObjectId,
				version: '0',
				digest: createSyntheticDigest(3_000_000_000n),
			},
		];

		const results = await analyze({ coins }, { client, transaction: JSON.stringify(json) });

		const coin = results.coins.result?.[reservationObjectId];
		expect(coin).toBeDefined();
		expect(coin?.isCoinReservation).toBe(true);
		expect(coin?.balance).toBe(3_000_000_000n);
		expect(coin?.coinType).toBe(HANEUL);
	});
});

// XOR two 32-byte hex strings; returns a 0x-prefixed hex string.
function xorIds(aHex: string, bHex: string): string {
	const a = fromHex(aHex.startsWith('0x') ? aHex.slice(2) : aHex);
	const b = fromHex(bHex.startsWith('0x') ? bHex.slice(2) : bHex);
	const out = new Uint8Array(32);
	for (let i = 0; i < 32; i++) out[i] = a[i] ^ b[i];
	return `0x${toHex(out)}`;
}

function accumulatorFieldType(coinType: string): string {
	return normalizeStructTag(
		`0x2::dynamic_field::Field<0x2::accumulator::Key<0x2::balance::Balance<${coinType}>>, 0x2::accumulator::U128>`,
	);
}

describe('Coin Flows - input reservation refs', () => {
	it('resolves input reservation ref via accumulator lookup and tracks sender outflow', async () => {
		const client = new MockHaneulClient();
		// 32-byte chain identifier; using a fixed non-zero pattern exercises real unmask
		const chainBytes = new Uint8Array(32).fill(0x44);
		client.setChainIdentifier(toBase58(chainBytes));
		const chainHex = toHex(chainBytes);

		// Pick an accumulator field ID, then compute the ref's masked ID.
		const accumulatorId = normalizeHaneulAddress('0xa11ca');
		const maskedId = xorIds(accumulatorId, chainHex);

		// Register an accumulator field object at the unmasked ID with USDC type.
		client.addObject({
			objectId: accumulatorId,
			objectType: accumulatorFieldType('0xa0b::usdc::USDC'),
			owner: { $kind: 'AddressOwner', AddressOwner: DEFAULT_SENDER },
		});

		const reservationDigest = createSyntheticDigest(1_500_000_000n);
		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);
		const coin = tx.object(
			Inputs.ObjectRef({ objectId: maskedId, version: '0', digest: reservationDigest }),
		);
		tx.transferObjects([coin], tx.pure.address('0x456'));

		const results = await analyze({ balanceFlows }, { client, transaction: await tx.toJSON() });

		const usdcFlow = results.balanceFlows.result?.sender.find(
			(f) => f.coinType === normalizeStructTag('0xa0b::usdc::USDC'),
		);
		expect(usdcFlow).toBeDefined();
		expect(usdcFlow!.amount).toBe(-1_500_000_000n);
	});

	it('emits an issue when the accumulator field cannot be resolved', async () => {
		const client = new MockHaneulClient();
		const chainBytes = new Uint8Array(32).fill(0x44);
		client.setChainIdentifier(toBase58(chainBytes));
		const chainHex = toHex(chainBytes);

		// Point at an accumulator ID that was never registered with the mock.
		const accumulatorId = normalizeHaneulAddress('0xdead1');
		const maskedId = xorIds(accumulatorId, chainHex);

		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);
		const coin = tx.object(
			Inputs.ObjectRef({
				objectId: maskedId,
				version: '0',
				digest: createSyntheticDigest(1n),
			}),
		);
		tx.transferObjects([coin], tx.pure.address('0x456'));

		const results = await analyze({ coins }, { client, transaction: await tx.toJSON() });
		expect(results.coins.issues).toBeDefined();
		expect(results.coins.issues!.some((i) => /could not be resolved/.test(i.message))).toBe(true);
	});

	it('splitCoins(tx.gas, ...) with empty payment flags over-split (tx.gas unusable)', async () => {
		const client = new MockHaneulClient();
		// Use an address that has no default HANEUL coins so the mock's plugin
		// leaves `payment: []` in place rather than falling back to a coin.
		const abOnlySender = normalizeHaneulAddress('0xab000001');
		const tx = new Transaction();
		tx.setSender(abOnlySender);
		const [split] = tx.splitCoins(tx.gas, [2_000_000_000n]);
		tx.transferObjects([split], tx.pure.address('0x456'));

		const json = JSON.parse(await tx.toJSON());
		json.gasData.payment = [];
		json.gasData.budget = '10000000';

		const results = await analyze({ balanceFlows }, { client, transaction: JSON.stringify(json) });
		// With payment:[] tx.gas can't be used in the PTB. The analyzer flags
		// any draw from it as over-split against a zero-balance coin.
		expect(results.balanceFlows.issues?.some((i) => /SplitCoins at command/.test(i.message))).toBe(
			true,
		);
	});

	it('emits an issue when the unmasked object is not a balance accumulator field', async () => {
		const client = new MockHaneulClient();
		const chainBytes = new Uint8Array(32).fill(0x44);
		client.setChainIdentifier(toBase58(chainBytes));
		const chainHex = toHex(chainBytes);

		const accumulatorId = normalizeHaneulAddress('0xabc123');
		const maskedId = xorIds(accumulatorId, chainHex);

		// Register a regular (non-accumulator) object at the unmasked ID.
		client.addObject({
			objectId: accumulatorId,
			objectType: normalizeStructTag('0x2::coin::Coin<0x2::haneul::HANEUL>'),
			owner: { $kind: 'AddressOwner', AddressOwner: DEFAULT_SENDER },
		});

		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);
		const coin = tx.object(
			Inputs.ObjectRef({
				objectId: maskedId,
				version: '0',
				digest: createSyntheticDigest(1n),
			}),
		);
		tx.transferObjects([coin], tx.pure.address('0x456'));

		const results = await analyze({ coins }, { client, transaction: await tx.toJSON() });
		expect(results.coins.issues).toBeDefined();
		expect(
			results.coins.issues!.some((i) => /not a balance accumulator field/.test(i.message)),
		).toBe(true);
	});
});
