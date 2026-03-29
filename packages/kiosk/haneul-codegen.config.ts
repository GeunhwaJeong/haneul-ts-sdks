// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { HaneulCodegenConfig } from '@haneullabs/codegen';

// Generates BCS types for:
// 1. Haneul framework kiosk types from testnet (0x2 package)
// 2. Local kiosk package (if exists at ../../../apps/kiosk)

const config: HaneulCodegenConfig = {
	output: './src/contracts',
	packages: [
		{
			package: '0x0000000000000000000000000000000000000000000000000000000000000002',
			packageName: '0x2',
			network: 'testnet',
			generate: {
				modules: ['kiosk', 'kiosk_extension', 'transfer_policy'],
			},
		},
		{
			package: '@local-pkg/kiosk',
			path: '../../../apps/kiosk',
		},
	],
};

export default config;
