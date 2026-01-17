// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { UseQueryResult } from '@tanstack/react-query';
import { useQueries } from '@tanstack/react-query';

import { useHaneulClientContext } from './useHaneulClient.js';
import type { SuiRpcMethods, UseHaneulClientQueryOptions } from './useHaneulClientQuery.js';

type HaneulClientQueryOptions = SuiRpcMethods[keyof SuiRpcMethods] extends infer Method
	? Method extends {
			name: infer M extends keyof SuiRpcMethods;
			params?: infer P;
		}
		? undefined extends P
			? {
					method: M;
					params?: P;
					options?: UseHaneulClientQueryOptions<M, unknown>;
				}
			: {
					method: M;
					params: P;
					options?: UseHaneulClientQueryOptions<M, unknown>;
				}
		: never
	: never;

export type UseHaneulClientQueriesResults<Args extends readonly HaneulClientQueryOptions[]> = {
	-readonly [K in keyof Args]: Args[K] extends {
		method: infer M extends keyof SuiRpcMethods;
		readonly options?:
			| {
					select?: (...args: any[]) => infer R;
			  }
			| object;
	}
		? UseQueryResult<unknown extends R ? SuiRpcMethods[M]['result'] : R>
		: never;
};

export function useHaneulClientQueries<
	const Queries extends readonly HaneulClientQueryOptions[],
	Results = UseHaneulClientQueriesResults<Queries>,
>({
	queries,
	combine,
}: {
	queries: Queries;
	combine?: (results: UseHaneulClientQueriesResults<Queries>) => Results;
}): Results {
	const suiContext = useHaneulClientContext();

	return useQueries({
		combine: combine as never,
		queries: queries.map((query) => {
			const { method, params, options: { queryKey = [], ...restOptions } = {} } = query;

			return {
				...restOptions,
				queryKey: [suiContext.network, method, params, ...queryKey],
				queryFn: async () => {
					return await suiContext.client[method](params as never);
				},
			};
		}) as [],
	});
}
