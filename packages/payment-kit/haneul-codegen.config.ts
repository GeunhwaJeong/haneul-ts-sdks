// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { HaneulCodegenConfig } from '@haneullabs/codegen';

const config: HaneulCodegenConfig = {
	output: './src/contracts',
	packages: [
		{
			package: '@haneullabs/payment-kit',
			path: '../../../sui-payment-kit',
		},
	],
};

export default config;
