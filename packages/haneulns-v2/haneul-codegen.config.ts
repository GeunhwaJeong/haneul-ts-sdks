// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { HaneulCodegenConfig } from '@haneullabs/codegen';

const config: HaneulCodegenConfig = {
	output: './src/contracts',
	packages: [
		{
			package: '@haneulns/core',
			path: '../../../haneulns-contracts/package./haneulns',
		},
		{
			package: '@haneulns/payments',
			path: '../../../haneulns-contracts/packages/payments',
		},
		{
			package: '@haneulns/coupons',
			path: '../../../haneulns-contracts/packages/coupons',
		},
		{
			package: '@haneulns/discounts',
			path: '../../../haneulns-contracts/packages/discounts',
		},
		{
			package: '@haneulns/subdomain-proxy',
			path: '../../../haneulns-contracts/packages/temp_subdomain_proxy',
		},
	],
};

export default config;
