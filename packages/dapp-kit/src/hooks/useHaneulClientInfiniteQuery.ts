// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { HaneulJsonRpcClient } from '@haneullabs/haneul/jsonRpc';
import type {
	InfiniteData,
	UseInfiniteQueryOptions,
	UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { useInfiniteQuery } from '@tanstack/react-query';

import type { PartialBy } from '../types/utilityTypes.js';
import { useSuiClientContext } from './useHaneulClient.js';

interface PaginatedResult {
	data?: unknown;
	nextCursor?: unknown;
	hasNextPage: boolean;
}

export type HaneulRpcPaginatedMethodName = {
	[K in keyof HaneulJsonRpcClient]: HaneulJsonRpcClient[K] extends (
		input: any,
	) => Promise<PaginatedResult>
		? K
		: never;
}[keyof HaneulJsonRpcClient];

export type HaneulRpcPaginatedMethods = {
	[K in HaneulRpcPaginatedMethodName]: HaneulJsonRpcClient[K] extends (
		input: infer Params,
	) => Promise<
		infer Result extends { hasNextPage?: boolean | null; nextCursor?: infer Cursor | null }
	>
		? {
				name: K;
				result: Result;
				params: Params;
				cursor: Cursor;
			}
		: never;
};

export type UseSuiClientInfiniteQueryOptions<
	T extends keyof HaneulRpcPaginatedMethods,
	TData,
> = PartialBy<
	Omit<
		UseInfiniteQueryOptions<HaneulRpcPaginatedMethods[T]['result'], Error, TData, unknown[]>,
		'queryFn' | 'initialPageParam' | 'getNextPageParam'
	>,
	'queryKey'
>;

export function useSuiClientInfiniteQuery<
	T extends keyof HaneulRpcPaginatedMethods,
	TData = InfiniteData<HaneulRpcPaginatedMethods[T]['result']>,
>(
	method: T,
	params: HaneulRpcPaginatedMethods[T]['params'],
	{
		queryKey = [],
		enabled = !!params,
		...options
	}: UseSuiClientInfiniteQueryOptions<T, TData> = {},
): UseInfiniteQueryResult<TData, Error> {
	const suiContext = useSuiClientContext();

	return useInfiniteQuery({
		...options,
		initialPageParam: null,
		queryKey: [suiContext.network, method, params, ...queryKey],
		enabled,
		queryFn: ({ pageParam }) =>
			suiContext.client[method]({
				// oxlint-disable-next-line no-useless-fallback-in-spread
				...(params ?? {}),
				cursor: pageParam,
			} as never),
		getNextPageParam: (lastPage) => (lastPage.hasNextPage ? (lastPage.nextCursor ?? null) : null),
	});
}
