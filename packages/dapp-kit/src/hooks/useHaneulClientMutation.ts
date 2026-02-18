// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import { useSuiClientContext } from './useHaneulClient.js';
import type { HaneulRpcMethods } from './useHaneulClientQuery.js';

export type UseSuiClientMutationOptions<T extends keyof HaneulRpcMethods> = Omit<
	UseMutationOptions<HaneulRpcMethods[T]['result'], Error, HaneulRpcMethods[T]['params'], unknown[]>,
	'mutationFn'
>;

export function useSuiClientMutation<T extends keyof HaneulRpcMethods>(
	method: T,
	options: UseSuiClientMutationOptions<T> = {},
): UseMutationResult<HaneulRpcMethods[T]['result'], Error, HaneulRpcMethods[T]['params'], unknown[]> {
	const suiContext = useSuiClientContext();

	return useMutation({
		...options,
		mutationFn: async (params) => {
			return await suiContext.client[method](params as never);
		},
	});
}
