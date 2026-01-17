// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { DAppKit, RegisteredDAppKit } from '@haneullabs/dapp-kit-core';
import { useStore } from '@nanostores/react';
import { useDAppKit } from './useDAppKit.js';

export type UseHaneulClientOptions<TDAppKit extends DAppKit<any>> = {
	dAppKit?: TDAppKit;
};

export function useHaneulClient<TDAppKit extends DAppKit<any> = RegisteredDAppKit>({
	dAppKit,
}: UseHaneulClientOptions<TDAppKit> = {}) {
	const instance = useDAppKit(dAppKit);
	return useStore(instance.stores.$currentClient) as ReturnType<TDAppKit['getClient']>;
}
