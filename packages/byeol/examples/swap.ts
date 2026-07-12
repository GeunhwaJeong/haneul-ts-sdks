// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/**
 * This example demonstrates how to execute swaps on Byeol:
 * - Swap exact base for quote (sell)
 * - Swap exact quote for base (buy)
 *
 * Usage:
 *   PRIVATE_KEY=haneulprivkey1... npx tsx examples/swap.ts
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { homedir } from 'os';
import path from 'path';

import { HaneulGrpcClient } from '@haneullabs/haneul/grpc';
import { decodeHaneulPrivateKey } from '@haneullabs/haneul/cryptography';
import { Ed25519Keypair } from '@haneullabs/haneul/keypairs/ed25519';
import { fromBase64 } from '@haneullabs/haneul/utils';
import { Transaction } from '@haneullabs/haneul/transactions';

import { byeol } from '../src/index.js';

const HANEUL = process.env.HANEUL_BINARY ?? `haneul`;

const GRPC_URLS = {
	mainnet: 'http://158.69.54.239:9000',
	testnet: 'https://fullnode.testnet.haneul.io:443',
} as const;

type Network = 'mainnet' | 'testnet';

const getActiveAddress = () => {
	return execSync(`${HANEUL} client active-address`, { encoding: 'utf8' }).trim();
};

const getActiveNetwork = (): Network => {
	const env = execSync(`${HANEUL} client active-env`, { encoding: 'utf8' }).trim();
	if (env !== 'mainnet' && env !== 'testnet') {
		throw new Error(`Unsupported network: ${env}. Only 'mainnet' and 'testnet' are supported.`);
	}
	return env;
};

const getSigner = () => {
	if (process.env.PRIVATE_KEY) {
		const { scheme, secretKey } = decodeHaneulPrivateKey(process.env.PRIVATE_KEY);
		if (scheme === 'ED25519') return Ed25519Keypair.fromSecretKey(secretKey);
		throw new Error(`Unsupported scheme: ${scheme}`);
	}

	const sender = getActiveAddress();
	const keystore = JSON.parse(
		readFileSync(path.join(homedir(), '.haneul', 'haneul_config', 'haneul.keystore'), 'utf8'),
	);

	for (const priv of keystore) {
		const raw = fromBase64(priv);
		if (raw[0] !== 0) continue;
		const pair = Ed25519Keypair.fromSecretKey(raw.slice(1));
		if (pair.getPublicKey().toHaneulAddress() === sender) return pair;
	}

	throw new Error(`keypair not found for sender: ${sender}`);
};

(async () => {
	const network = getActiveNetwork();
	const signer = getSigner();
	const address = signer.getPublicKey().toHaneulAddress();

	console.log(`Using address: ${address}`);
	console.log(`Network: ${network}\n`);

	const balanceManagers = {
		MANAGER_1: {
			address: '0xYOUR_BALANCE_MANAGER_ADDRESS', // Replace with your balance manager
			tradeCap: '',
		},
	};

	const client = new HaneulGrpcClient({ network, baseUrl: GRPC_URLS[network] }).$extend(
		byeol({
			address,
			balanceManagers,
		}),
	);

	const poolKey = network === 'mainnet' ? 'HANEUL_USDC' : 'HANEUL_DBUSDC';

	// First, check what we'd get for swapping
	console.log('--- Swap Quotes ---');
	const quoteOut = await client.byeol.getQuoteQuantityOut(poolKey, 1);
	console.log(`Selling 1 base -> quote out:`, quoteOut);

	const baseOut = await client.byeol.getBaseQuantityOut(poolKey, 10);
	console.log(`Buying with 10 quote -> base out:`, baseOut);

	// Example: Swap exact base for quote (sell HANEUL for USDC)
	const tx = new Transaction();

	// swapExactBaseForQuote: sell exact amount of base asset
	const [baseOutCoin, quoteOutCoin, deepOutCoin] = tx.add(
		client.byeol.byeol.swapExactBaseForQuote({
			poolKey,
			amount: 0.1, // sell 0.1 HANEUL
			deepAmount: 0, // BYL fee amount (0 if not paying with BYL)
			minOut: 0, // minimum quote out (set to 0 for no slippage protection)
		}),
	);

	tx.transferObjects([baseOutCoin, quoteOutCoin, deepOutCoin], address);

	console.log('\nTransaction built. Uncomment signAndExecute to run.');

	// Uncomment to execute:
	// const result = await client.signAndExecuteTransaction({
	// 	transaction: tx,
	// 	signer,
	// 	include: { effects: true },
	// });
	// console.log('Result:', result);
})();
