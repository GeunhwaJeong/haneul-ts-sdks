// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { HaneulJsonRpcClient } from '@haneullabs/haneul/jsonRpc';
import type {
	UndefinedInitialDataOptions,
	UseQueryOptions,
	UseQueryResult,
} from '@tanstack/react-query';
import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { PartialBy } from '../types/utilityTypes.js';
import { useSuiClientContext } from './useHaneulClient.js';

export type HaneulRpcMethodName = {
	[K in keyof HaneulJsonRpcClient]: HaneulJsonRpcClient[K] extends
		| ((input: any) => Promise<any>)
		| (() => Promise<any>)
		? K
		: never;
}[keyof HaneulJsonRpcClient];

export type HaneulRpcMethods = {
	[K in HaneulRpcMethodName]: HaneulJsonRpcClient[K] extends (input: infer P) => Promise<infer R>
		? {
				name: K;
				result: R;
				params: P;
			}
		: HaneulJsonRpcClient[K] extends () => Promise<infer R>
			? {
					name: K;
					result: R;
					params: undefined | object;
				}
			: never;
};

export type UseSuiClientQueryOptions<T extends keyof HaneulRpcMethods, TData> = PartialBy<
	Omit<UseQueryOptions<HaneulRpcMethods[T]['result'], Error, TData, unknown[]>, 'queryFn'>,
	'queryKey'
>;

export type GetSuiClientQueryOptions<T extends keyof HaneulRpcMethods> = {
	client: HaneulJsonRpcClient;
	network: string;
	method: T;
	options?: PartialBy<
		Omit<UndefinedInitialDataOptions<HaneulRpcMethods[T]['result']>, 'queryFn'>,
		'queryKey'
	>;
} & (undefined extends HaneulRpcMethods[T]['params']
	? { params?: HaneulRpcMethods[T]['params'] }
	: { params: HaneulRpcMethods[T]['params'] });

export function getSuiClientQuery<T extends keyof HaneulRpcMethods>({
	client,
	network,
	method,
	params,
	options,
}: GetSuiClientQueryOptions<T>) {
	return queryOptions<HaneulRpcMethods[T]['result']>({
		...options,
		queryKey: [network, method, params],
		queryFn: async () => {
			return await client[method](params as never);
		},
	});
}

export function useSuiClientQuery<
	T extends keyof HaneulRpcMethods,
	TData = HaneulRpcMethods[T]['result'],
>(
	...args: undefined extends HaneulRpcMethods[T]['params']
		? [method: T, params?: HaneulRpcMethods[T]['params'], options?: UseSuiClientQueryOptions<T, TData>]
		: [method: T, params: HaneulRpcMethods[T]['params'], options?: UseSuiClientQueryOptions<T, TData>]
): UseQueryResult<TData, Error> {
	const [method, params, { queryKey = [], ...options } = {}] = args as [
		method: T,
		params?: HaneulRpcMethods[T]['params'],
		options?: UseSuiClientQueryOptions<T, TData>,
	];

	const suiContext = useSuiClientContext();

	return useQuery({
		...options,
		queryKey: [suiContext.network, method, params, ...queryKey],
		queryFn: async () => {
			return await suiContext.client[method](params as never);
		},
	});
}

export function useSuiClientSuspenseQuery<
	T extends keyof HaneulRpcMethods,
	TData = HaneulRpcMethods[T]['result'],
>(
	...args: undefined extends HaneulRpcMethods[T]['params']
		? [method: T, params?: HaneulRpcMethods[T]['params'], options?: UndefinedInitialDataOptions<TData>]
		: [method: T, params: HaneulRpcMethods[T]['params'], options?: UndefinedInitialDataOptions<TData>]
) {
	const [method, params, options = {}] = args as [
		method: T,
		params?: HaneulRpcMethods[T]['params'],
		options?: UndefinedInitialDataOptions<TData>,
	];

	const suiContext = useSuiClientContext();

	const query = useMemo(() => {
		return getSuiClientQuery<T>({
			client: suiContext.client,
			network: suiContext.network,
			method,
			params,
			options,
		});
	}, [suiContext.client, suiContext.network, method, params, options]);

	return useSuspenseQuery(query);
}
