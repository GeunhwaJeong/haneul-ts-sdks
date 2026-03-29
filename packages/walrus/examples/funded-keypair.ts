// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { HaneulGrpcClient } from '@haneullabs/haneul/grpc';
import { getFaucetHost, requestHaneulFromFaucetV2 } from '@haneullabs/haneul/faucet';
import { Ed25519Keypair } from '@haneullabs/haneul/keypairs/ed25519';
import { coinWithBalance, Transaction } from '@haneullabs/haneul/transactions';
import { GEUNHWA_PER_HANEUL, parseStructTag } from '@haneullabs/haneul/utils';

import { TESTNET_WALRUS_PACKAGE_CONFIG } from '../src/index.js';

export async function getFundedKeypair() {
	const haneulClient = new HaneulGrpcClient({
		network: 'testnet',
		baseUrl: 'https://fullnode.testnet.haneul.io:443',
	});

	const keypair = Ed25519Keypair.fromSecretKey(
		'haneulprivkey1qzmcxscyglnl9hnq82crqsuns0q33frkseks5jw0fye3tuh83l7e6ajfhxx',
	);
	console.log(keypair.toHaneulAddress());

	const { balance } = await haneulClient.getBalance({
		owner: keypair.toHaneulAddress(),
	});

	if (BigInt(balance.balance) < GEUNHWA_PER_HANEUL) {
		await requestHaneulFromFaucetV2({
			host: getFaucetHost('testnet'),
			recipient: keypair.toHaneulAddress(),
		});
	}

	const walBalance = await haneulClient.getBalance({
		owner: keypair.toHaneulAddress(),
		coinType: `0x8270feb7375eee355e64fdb69c50abb6b5f9393a722883c1cf45f8e26048810a::wal::WAL`,
	});
	console.log('wal balance:', walBalance.balance);

	if (Number(walBalance.balance) < Number(GEUNHWA_PER_HANEUL) / 2) {
		const tx = new Transaction();

		const exchange = await haneulClient.getObject({
			objectId: TESTNET_WALRUS_PACKAGE_CONFIG.exchangeIds[0],
		});

		// oxlint-disable-next-line no-non-null-asserted-optional-chain
		const exchangePackageId = parseStructTag(exchange.object.type).address;

		const wal = tx.moveCall({
			package: exchangePackageId,
			module: 'wal_exchange',
			function: 'exchange_all_for_wal',
			arguments: [
				tx.object(TESTNET_WALRUS_PACKAGE_CONFIG.exchangeIds[0]),
				coinWithBalance({
					balance: GEUNHWA_PER_HANEUL / 2n,
				}),
			],
		});

		tx.transferObjects([wal], keypair.toHaneulAddress());

		const result = await haneulClient.signAndExecuteTransaction({
			transaction: tx,
			signer: keypair,
		});

		await haneulClient.waitForTransaction({
			digest: (result.Transaction ?? result.FailedTransaction).digest,
		});

		console.log((result.Transaction ?? result.FailedTransaction).effects);
	}

	return keypair;
}
