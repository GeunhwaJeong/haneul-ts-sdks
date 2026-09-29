// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { HaneulCodegenConfig } from '@haneullabs/codegen';

const config: HaneulCodegenConfig = {
	output: './src/contracts',
	packages: [
		{
			package: '@local-pkg/hashi', // TODO: update this when hashi is published on MVR.
			path: '../../../hashi/packages/hashi',
		},
	],
};

export default config;
