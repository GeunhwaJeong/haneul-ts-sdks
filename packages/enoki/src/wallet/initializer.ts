// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { ClientWithCoreApi, Experimental_HaneulClientTypes } from '@haneullabs/haneul/experimental';
import { registerEnokiWallets } from './register.js';
import type { RegisterEnokiWalletsOptions } from './types.js';

export function enokiWalletsInitializer(
	options: Omit<RegisterEnokiWalletsOptions, 'clients' | 'getCurrentNetwork'>,
) {
	return {
		id: 'enoki-wallets-initializer',
		async initialize({
			networks,
			getClient,
		}: {
			networks: readonly Experimental_HaneulClientTypes.Network[];
			getClient: (network?: Experimental_HaneulClientTypes.Network) => ClientWithCoreApi;
		}) {
			const { unregister } = registerEnokiWallets({
				...options,
				getCurrentNetwork: () => getClient().network,
				clients: networks.map(getClient),
			});

			return { unregister };
		},
	};
}
