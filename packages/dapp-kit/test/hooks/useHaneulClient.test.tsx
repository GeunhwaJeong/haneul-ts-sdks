// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { getJsonRpcFullnodeUrl, HaneulJsonRpcClient } from '@haneullabs/haneul/jsonRpc';
import { renderHook } from '@testing-library/react';

import { useSuiClient } from '../../src/index.js';
import { createSuiClientContextWrapper } from '../test-utils.js';

describe('useSuiClient', () => {
	test('throws without a HaneulClientContext', () => {
		expect(() => renderHook(() => useSuiClient())).toThrowError(
			'Could not find HaneulClientContext. Ensure that you have set up the HaneulClientProvider',
		);
	});

	test('returns a HaneulJsonRpcClient', () => {
		const suiClient = new HaneulJsonRpcClient({
			url: getJsonRpcFullnodeUrl('localnet'),
			network: 'localnet',
		});
		const wrapper = createSuiClientContextWrapper(suiClient);
		const { result } = renderHook(() => useSuiClient(), { wrapper });

		expect(result.current).toBe(suiClient);
	});
});
