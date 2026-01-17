// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { HaneulClient } from '@haneullabs/haneul/client';
import type {
	UndefinedInitialDataOptions,
	UseQueryOptions,
	UseQueryResult,
} from '@tanstack/react-query';
import { queryOptions, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { PartialBy } from '../types/utilityTypes.js';
import { useHaneulClientContext } from './useHaneulClient.js';

export type SuiRpcMethodName = {
	[K in keyof HaneulClient]: HaneulClient[K] extends ((input: any) => Promise<any>) | (() => Promise<any>)
		? K
		: never;
}[keyof HaneulClient];

export type SuiRpcMethods = {
	[K in SuiRpcMethodName]: HaneulClient[K] extends (input: infer P) => Promise<infer R>
		? {
				name: K;
				result: R;
				params: P;
			}
		: HaneulClient[K] extends () => Promise<infer R>
			? {
					name: K;
					result: R;
					params: undefined | object;
				}
			: never;
};

export type UseHaneulClientQueryOptions<T extends keyof SuiRpcMethods, TData> = PartialBy<
	Omit<UseQueryOptions<SuiRpcMethods[T]['result'], Error, TData, unknown[]>, 'queryFn'>,
	'queryKey'
>;

export type GetHaneulClientQueryOptions<T extends keyof SuiRpcMethods> = {
	client: HaneulClient;
	network: string;
	method: T;
	options?: PartialBy<
		Omit<UndefinedInitialDataOptions<SuiRpcMethods[T]['result']>, 'queryFn'>,
		'queryKey'
	>;
} & (undefined extends SuiRpcMethods[T]['params']
	? { params?: SuiRpcMethods[T]['params'] }
	: { params: SuiRpcMethods[T]['params'] });

export function getHaneulClientQuery<T extends keyof SuiRpcMethods>({
	client,
	network,
	method,
	params,
	options,
}: GetHaneulClientQueryOptions<T>) {
	return queryOptions<SuiRpcMethods[T]['result']>({
		...options,
		queryKey: [network, method, params],
		queryFn: async () => {
			return await client[method](params as never);
		},
	});
}

export function useHaneulClientQuery<
	T extends keyof SuiRpcMethods,
	TData = SuiRpcMethods[T]['result'],
>(
	...args: undefined extends SuiRpcMethods[T]['params']
		? [method: T, params?: SuiRpcMethods[T]['params'], options?: UseHaneulClientQueryOptions<T, TData>]
		: [method: T, params: SuiRpcMethods[T]['params'], options?: UseHaneulClientQueryOptions<T, TData>]
): UseQueryResult<TData, Error> {
	const [method, params, { queryKey = [], ...options } = {}] = args as [
		method: T,
		params?: SuiRpcMethods[T]['params'],
		options?: UseHaneulClientQueryOptions<T, TData>,
	];

	const suiContext = useHaneulClientContext();

	return useQuery({
		...options,
		queryKey: [suiContext.network, method, params, ...queryKey],
		queryFn: async () => {
			return await suiContext.client[method](params as never);
		},
	});
}

export function useHaneulClientSuspenseQuery<
	T extends keyof SuiRpcMethods,
	TData = SuiRpcMethods[T]['result'],
>(
	...args: undefined extends SuiRpcMethods[T]['params']
		? [method: T, params?: SuiRpcMethods[T]['params'], options?: UndefinedInitialDataOptions<TData>]
		: [method: T, params: SuiRpcMethods[T]['params'], options?: UndefinedInitialDataOptions<TData>]
) {
	const [method, params, options = {}] = args as [
		method: T,
		params?: SuiRpcMethods[T]['params'],
		options?: UndefinedInitialDataOptions<TData>,
	];

	const suiContext = useHaneulClientContext();

	const query = useMemo(() => {
		return getHaneulClientQuery<T>({
			client: suiContext.client,
			network: suiContext.network,
			method,
			params,
			options,
		});
	}, [suiContext.client, suiContext.network, method, params, options]);

	return useSuspenseQuery(query);
}
