// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/**
 * Check USDC balance for a balance manager on mainnet using a direct address.
 * Uses checkManagerBalanceWithAddress which doesn't require registering the manager at init time.
 *
 * Usage:
 *   npx tsx examples/checkBalance.ts
 */

import { execSync } from 'child_process';

import { HaneulGrpcClient } from '@haneullabs/haneul/grpc';

import { deepbook } from '../src/index.js';

const HANEUL = process.env.SUI_BINARY ?? `haneul`;

const GRPC_URLS = {
	mainnet: 'https://fullnode.mainnet.haneul.io:443',
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
		deepbook({ address: '0x0' }),
	);

	const result = await client.deepbook.checkManagerBalanceWithAddress(
		'0x344c2734b1d211bd15212bfb7847c66a3b18803f3f5ab00f5ff6f87b6fe6d27d',
		'USDC',
	);
	console.log(result);
})();
