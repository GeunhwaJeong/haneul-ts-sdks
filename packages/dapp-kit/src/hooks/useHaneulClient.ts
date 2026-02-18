// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { HaneulJsonRpcClient } from '@haneullabs/haneul/jsonRpc';
import { useContext } from 'react';

import { HaneulClientContext } from '../components/HaneulClientProvider.js';

export function useSuiClientContext() {
	const suiClient = useContext(HaneulClientContext);

	if (!suiClient) {
		throw new Error(
			'Could not find HaneulClientContext. Ensure that you have set up the HaneulClientProvider',
		);
	}

	return suiClient;
}

export function useSuiClient(): HaneulJsonRpcClient {
	return useSuiClientContext().client;
}
