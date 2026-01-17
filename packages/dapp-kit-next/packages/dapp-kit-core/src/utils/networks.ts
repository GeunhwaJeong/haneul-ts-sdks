// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { Experimental_HaneulClientTypes } from '@haneullabs/sui/experimental';
import type { IdentifierString } from '@haneullabs/wallet-standard';
import { DAppKitError } from './errors.js';
import type { DAppKitCompatibleClient } from '../core/types.js';

export type Networks = Experimental_HaneulClientTypes.Network[];

export function getChain(network: Experimental_HaneulClientTypes.Network): IdentifierString {
	return `sui:${network}`;
}

export function createNetworkConfig<
	TNetworks extends Networks,
	Client extends DAppKitCompatibleClient,
>(networks: TNetworks, createClient: (network: TNetworks[number]) => Client) {
	if (networks.length === 0) {
		throw new DAppKitError('You must specify at least one Haneul network for your application.');
	}

	const networkConfig = new Map<TNetworks[number], Client>();
	function getClient<T extends TNetworks[number]>(network: T | TNetworks[number]) {
		if (networkConfig.has(network)) {
			return networkConfig.get(network)!;
		}

		const client = createClient(network);
		networkConfig.set(network, client);
		return client;
	}

	return { networkConfig: Object.freeze(networkConfig), getClient };
}
