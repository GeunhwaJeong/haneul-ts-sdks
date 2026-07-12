// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/**
 * This example demonstrates how to query pool information:
 * - Pool ID
 * - Whitelisted / stable / registered status
 * - BYL price for the pool
 * - Trade and book params
 * - Vault balances
 *
 * Usage:
 *   npx tsx examples/poolInfo.ts
 */

import { execSync } from 'child_process';

import { HaneulGrpcClient } from '@haneullabs/haneul/grpc';

import { byeol } from '../src/index.js';

const HANEUL = process.env.HANEUL_BINARY ?? `haneul`;

const GRPC_URLS = {
	mainnet: 'http://158.69.54.239:9000',
	testnet: 'https://fullnode.testnet.haneul.io:443',
} as const;

type Network = 'mainnet' | 'testnet';

const getActiveNetwork = (): Network => {
	const env = execSync(`${HANEUL} client active-env`, { encoding: 'utf8' }).trim();
	if (env !== 'mainnet' && env !== 'testnet') {
		throw new Error(`Unsupported network: ${env}. Only 'mainnet' and 'testnet' are supported.`);
	}
	return env;
};

(async () => {
	const network = getActiveNetwork();

	const client = new HaneulGrpcClient({ network, baseUrl: GRPC_URLS[network] }).$extend(
		byeol({ address: '0x0' }),
	);

	const poolKey = network === 'mainnet' ? 'HANEUL_USDC' : 'HANEUL_DBUSDC';
	console.log(`Querying pool info for: ${poolKey} (${network})\n`);

	// 1. Pool ID
	const poolId = await client.byeol.poolId(poolKey);
	console.log('Pool ID:', poolId);

	// 2. Whitelisted
	const isWhitelisted = await client.byeol.whitelisted(poolKey);
	console.log('Whitelisted:', isWhitelisted);

	// 3. Stable pool
	const isStable = await client.byeol.stablePool(poolKey);
	console.log('Stable pool:', isStable);

	// 4. Registered pool
	const isRegistered = await client.byeol.registeredPool(poolKey);
	console.log('Registered:', isRegistered);

	// 5. BYL price
	const deepPrice = await client.byeol.getPoolBylPrice(poolKey);
	console.log('BYL price:', deepPrice);

	// 6. Trade params
	const tradeParams = await client.byeol.poolTradeParams(poolKey);
	console.log('Trade params:', tradeParams);

	// 7. Book params
	const bookParams = await client.byeol.poolBookParams(poolKey);
	console.log('Book params:', bookParams);

	// 8. Vault balances
	const vaults = await client.byeol.vaultBalances(poolKey);
	console.log('Vault balances:', vaults);

	// 9. Mid price
	const mid = await client.byeol.midPrice(poolKey);
	console.log('Mid price:', mid);
})();
