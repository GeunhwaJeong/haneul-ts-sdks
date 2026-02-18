// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/**
 * This example demonstrates how to:
 * 1. Batch update Pyth price feeds for all 4 mainnet assets (HANEUL, USDC, DEEP, WAL)
 * 2. Update the current price for SUI_USDC, DEEP_USDC, and WAL_USDC pools
 *
 * Usage:
 *   npx tsx examples/updateCurrentPriceExample.ts
 *
 * Or with a private key:
 *   PRIVATE_KEY=haneulprivkey1... npx tsx examples/updateCurrentPriceExample.ts
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { homedir } from 'os';
import path from 'path';

import { HaneulGrpcClient } from '@haneullabs/haneul/grpc';
import { decodeSuiPrivateKey } from '@haneullabs/haneul/cryptography';
import { Ed25519Keypair } from '@haneullabs/haneul/keypairs/ed25519';
import { Secp256k1Keypair } from '@haneullabs/haneul/keypairs/secp256k1';
import { Secp256r1Keypair } from '@haneullabs/haneul/keypairs/secp256r1';
import { fromBase64 } from '@haneullabs/haneul/utils';
import { Transaction } from '@haneullabs/haneul/transactions';

import { deepbook } from '../src/index.js';

const HANEUL = process.env.SUI_BINARY ?? `haneul`;

const GRPC_URLS = {
	mainnet: 'https://fullnode.mainnet.haneul.io:443',
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
		console.log('Using supplied private key.');
		const { scheme, secretKey } = decodeSuiPrivateKey(process.env.PRIVATE_KEY);

		if (scheme === 'ED25519') return Ed25519Keypair.fromSecretKey(secretKey);
		if (scheme === 'Secp256k1') return Secp256k1Keypair.fromSecretKey(secretKey);
		if (scheme === 'Secp256r1') return Secp256r1Keypair.fromSecretKey(secretKey);

		throw new Error('Keypair not supported.');
	}

	const sender = getActiveAddress();

	const keystore = JSON.parse(
		readFileSync(path.join(homedir(), '.haneul', 'haneul_config', 'haneul.keystore'), 'utf8'),
	);

	for (const priv of keystore) {
		const raw = fromBase64(priv);
		if (raw[0] !== 0) {
			continue;
		}

		const pair = Ed25519Keypair.fromSecretKey(raw.slice(1));
		if (pair.getPublicKey().toSuiAddress() === sender) {
			return pair;
		}
	}

	throw new Error(`keypair not found for sender: ${sender}`);
};

(async () => {
	const network = getActiveNetwork();
	const signer = getSigner();
	const address = signer.getPublicKey().toSuiAddress();

	console.log(`Using address: ${address}`);
	console.log(`Network: ${network}\n`);

	const client = new HaneulGrpcClient({ network, baseUrl: GRPC_URLS[network] }).$extend(
		deepbook({ address }),
	);

	// All 4 mainnet assets with Pyth price feeds
	const coinKeys = ['HANEUL', 'USDC', 'DEEP', 'WAL'];

	// Pools to update current price for
	const poolKeys = ['SUI_USDC', 'DEEP_USDC', 'WAL_USDC'];

	console.log(`Step 1: Batch updating Pyth price feeds for: ${coinKeys.join(', ')}\n`);

	try {
		const tx = new Transaction();

		// Batch fetch and update all price feeds
		// Only stale feeds (older than 30 seconds) will be updated
		const priceInfoObjects = await client.deepbook.getPriceInfoObjects(tx, coinKeys);

		console.log('Price Info Objects:');
		for (const [coinKey, objectId] of Object.entries(priceInfoObjects)) {
			console.log(`  ${coinKey}: ${objectId}`);
		}

		console.log(`\nStep 2: Updating current price for pools: ${poolKeys.join(', ')}\n`);

		// Update current price for each pool
		for (const poolKey of poolKeys) {
			client.deepbook.poolProxy.updateCurrentPrice(poolKey)(tx);
			console.log(`  Added updateCurrentPrice for ${poolKey}`);
		}

		// Check transaction commands
		const txData = tx.getData();
		const commandCount = txData.commands.length;

		console.log(`\nTotal commands in transaction: ${commandCount}`);
		console.log('Signing and executing transaction...\n');

		const result = await client.signAndExecuteTransaction({
			transaction: tx,
			signer,
			include: {
				effects: true,
			},
		});

		if (result.$kind === 'Transaction') {
			console.log('Transaction successful!');
			console.log('Digest:', result.Transaction.digest);
		} else {
			console.log('Transaction failed!');
			console.log('Error:', result.FailedTransaction.status);
		}
	} catch (error) {
		console.error('Error:', error);
	}
})();
