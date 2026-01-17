// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { HaneulCodegenConfig } from '@haneullabs/codegen';

const config: HaneulCodegenConfig = {
	output: './src/contracts',
	packages: [
		{
			package: '@deepbook/core',
			path: '../../../deepbookv3/packages/deepbook',
		},
	],
};

export default config;
