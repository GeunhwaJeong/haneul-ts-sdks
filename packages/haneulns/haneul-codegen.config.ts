// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { HaneulCodegenConfig } from '@haneullabs/codegen';

const config: HaneulCodegenConfig = {
	output: './src/contracts',
	packages: [
		// Local HaneulNS contracts
		{ package: '@haneulns/core', path: '../../../haneulns-contracts/package./haneulns' },
		{ package: '@haneulns/payments', path: '../../../haneulns-contracts/packages/payments' },
		{ package: '@haneulns/coupons', path: '../../../haneulns-contracts/packages/coupons' },
		{ package: '@haneulns/discounts', path: '../../../haneulns-contracts/packages/discounts' },
		{
			package: '@haneulns/subdomain-proxy',
			path: '../../../haneulns-contracts/packages/temp_subdomain_proxy',
		},
		// Pyth - only need State type to get upgrade_cap.package
		{
			package: '0xabf837e98c26087cba0883c0a7a28326b1fa3c5e1e2c5abdb486f9e8f594c837',
			packageName: 'pyth',
			network: 'testnet',
			generate: {
				modules: { state: { types: ['State'] } },
			},
		},
		// Wormhole - only need State type to get upgrade_cap.package
		{
			package: '0xf47329f4344f3bf0f8e436e2f7b485466cff300f12a166563995d3888c296a94',
			packageName: 'wormhole',
			network: 'testnet',
			generate: {
				modules: { state: { types: ['State'] } },
			},
		},
	],
};

export default config;
