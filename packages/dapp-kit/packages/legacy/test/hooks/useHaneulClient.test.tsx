// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { getJsonRpcFullnodeUrl, HaneulJsonRpcClient } from '@haneullabs/haneul/jsonRpc';
import { renderHook } from '@testing-library/react';

import { useHaneulClient } from '../../src/index.js';
import { createHaneulClientContextWrapper } from '../test-utils.js';

describe('useHaneulClient', () => {
	test('throws without a HaneulClientContext', () => {
		expect(() => renderHook(() => useHaneulClient())).toThrowError(
			'Could not find HaneulClientContext. Ensure that you have set up the HaneulClientProvider',
		);
	});

	test('returns a HaneulJsonRpcClient', () => {
		const haneulClient = new HaneulJsonRpcClient({
			url: getJsonRpcFullnodeUrl('localnet'),
			network: 'localnet',
		});
		const wrapper = createHaneulClientContextWrapper(haneulClient);
		const { result } = renderHook(() => useHaneulClient(), { wrapper });

		expect(result.current).toBe(haneulClient);
	});
});
