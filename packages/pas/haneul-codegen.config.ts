// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { HaneulCodegenConfig } from '@haneullabs/codegen';

const config: HaneulCodegenConfig = {
	output: './src/contracts',
	packages: [
		{
			package: '@haneullabs/pas',
			path: '../../../pas/packages/pas',
		},
		{
			package: '@haneullabs/ptb',
			path: '../../../pas/packages/ptb',
		},
		{
			package: '0x0000000000000000000000000000000000000000000000000000000000000002',
			packageName: 'haneul',
			network: 'testnet',
			generate: {
				modules: ['dynamic_field'],
			},
		},
	],
};

export default config;
