// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		testTimeout: 30000,
	},
	resolve: {
		alias: {
			'@haneullabs/bcs': new URL('../bcs/src', import.meta.url).pathname,
			'@haneullabs/sui': new URL('../typescript/src', import.meta.url).pathname,
			'@haneullabs/utils': new URL('../utils/src', import.meta.url).pathname,
			'@haneullabs/walrus-wasm': new URL('../walrus-wasm/src', import.meta.url).pathname,
		},
	},
});
