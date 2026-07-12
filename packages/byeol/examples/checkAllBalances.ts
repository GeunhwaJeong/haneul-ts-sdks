// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/**
 * Fetch multiple coin balances for balance managers and margin manager
 * balances in single dry run calls.
 *
 * Usage:
 *   npx tsx examples/checkAllBalances.ts
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

	// 1. Fetch all coin balances for multiple balance managers in one dry run
	// Example response:
	// {
	//   '0x344c...d27d': {
	//     '0xdeeb...::byl::BYL': 142027.888639,
	//     '0x0000...::haneul::HANEUL': 793052.598384511,
	//     '0xdba3...::usdc::USDC': 863270.964879,
	//     ...
	//   },
	//   '0x705a...6581': {
	//     '0xdeeb...::byl::BYL': 57542.587118,
	//     '0x0000...::haneul::HANEUL': 82488.361906133,
	//     '0xdba3...::usdc::USDC': 54561.821692,
	//     ...
	//   }
	// }
	const balanceManagerAddresses = ['<BALANCE_MANAGER_ADDRESS_1>', '<BALANCE_MANAGER_ADDRESS_2>'];

	const balances = await client.byeol.checkManagerBalancesWithAddress(balanceManagerAddresses, [
		'BYL',
		'HANEUL',
		'USDC',
		'WUSDC',
		'WETH',
		'BETH',
		'WBTC',
		'WUSDT',
		'NS',
		'TYPUS',
		'AUSD',
		'WAL',
		'HANEULUSDE',
		'DRF',
		'SEND',
		'XBTC',
		'IKA',
		'ALKIMI',
		'LZWBTC',
		'USDT',
		'WGIGA',
	]);

	console.log(balances);

	// 2. Fetch base/quote/byl balances for margin managers in one dry run
	// Example response:
	// {
	//   '0xca5c...cc0d': { base: '0.097675', quote: '5.611957', byl: '0' },
	//   '0xd0d8...1fc8': { base: '0.0985', quote: '3.605957', byl: '0' }
	// }
	const marginBalances = await client.byeol.getMarginManagerBalances({
		'<MARGIN_MANAGER_ADDRESS_1>': 'HANEUL_USDC',
		'<MARGIN_MANAGER_ADDRESS_2>': 'HANEUL_USDC',
	});

	console.log(marginBalances);
})();
