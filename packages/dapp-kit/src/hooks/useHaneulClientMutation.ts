// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import { useHaneulClientContext } from './useHaneulClient.js';
import type { SuiRpcMethods } from './useHaneulClientQuery.js';

export type UseHaneulClientMutationOptions<T extends keyof SuiRpcMethods> = Omit<
	UseMutationOptions<SuiRpcMethods[T]['result'], Error, SuiRpcMethods[T]['params'], unknown[]>,
	'mutationFn'
>;

export function useHaneulClientMutation<T extends keyof SuiRpcMethods>(
	method: T,
	options: UseHaneulClientMutationOptions<T> = {},
): UseMutationResult<SuiRpcMethods[T]['result'], Error, SuiRpcMethods[T]['params'], unknown[]> {
	const suiContext = useHaneulClientContext();

	return useMutation({
		...options,
		mutationFn: async (params) => {
			return await suiContext.client[method](params as never);
		},
	});
}
