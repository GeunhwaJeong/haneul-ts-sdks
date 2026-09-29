// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['test/unit/**/*.test.ts'],
	},
	resolve: {
		alias: {
			'@haneullabs/bcs': new URL('../bcs/src', import.meta.url).pathname,
			'@haneullabs/haneul': new URL('../haneul/src', import.meta.url).pathname,
		},
	},
});
