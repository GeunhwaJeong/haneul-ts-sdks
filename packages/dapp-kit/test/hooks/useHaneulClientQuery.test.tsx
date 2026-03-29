// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { getJsonRpcFullnodeUrl, HaneulJsonRpcClient } from '@haneullabs/haneul/jsonRpc';
import { renderHook, waitFor } from '@testing-library/react';

import { useHaneulClientQuery } from '../../src/hooks/useHaneulClientQuery.js';
import { createWalletProviderContextWrapper } from '../test-utils.js';

describe('useHaneulClientQuery', () => {
	it('should fetch data', async () => {
		const haneulClient = new HaneulJsonRpcClient({
			url: getJsonRpcFullnodeUrl('mainnet'),
			network: 'mainnet',
		});
		const wrapper = createWalletProviderContextWrapper({}, haneulClient);

		const queryTransactionBlocks = vi.spyOn(haneulClient, 'queryTransactionBlocks');

		queryTransactionBlocks.mockResolvedValueOnce({
			data: [{ digest: '0x123' }],
			hasNextPage: true,
			nextCursor: 'page2',
		});

		const { result } = renderHook(
			() =>
				useHaneulClientQuery('queryTransactionBlocks', {
					filter: {
						FromAddress: '0x123',
					},
				}),
			{ wrapper },
		);

		expect(result.current.isLoading).toBe(true);
		expect(result.current.isError).toBe(false);
		expect(result.current.data).toBe(undefined);
		expect(queryTransactionBlocks).toHaveBeenCalledWith({
			filter: {
				FromAddress: '0x123',
			},
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isError).toBe(false);
		expect(result.current.data).toEqual({
			data: [{ digest: '0x123' }],
			hasNextPage: true,
			nextCursor: 'page2',
		});
	});
});
