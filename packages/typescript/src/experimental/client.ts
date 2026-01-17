// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable @typescript-eslint/ban-types */

import type { Simplify, UnionToIntersection } from '@haneullabs/utils';
import { ClientCache } from './cache.js';
import type { Experimental_CoreClient } from './core.js';
import type {
	ClientWithExtensions,
	Experimental_HaneulClientTypes,
	HaneulClientRegistration,
} from './types.js';

export abstract class Experimental_BaseClient {
	network: Experimental_HaneulClientTypes.Network;
	cache: ClientCache;
	base: Experimental_BaseClient;

	constructor({
		network,
		base,
		cache = base?.cache ?? new ClientCache(),
	}: Experimental_HaneulClientTypes.HaneulClientOptions) {
		this.network = network;
		this.base = base ?? this;
		this.cache = cache;
	}

	abstract core: Experimental_CoreClient;

	$extend<const Registrations extends HaneulClientRegistration<this>[]>(
		...registrations: Registrations
	) {
		return Object.create(
			this,
			Object.fromEntries(
				registrations.map((registration) => {
					return [registration.name, { value: registration.register(this) }];
				}),
			),
		) as ClientWithExtensions<
			Simplify<
				UnionToIntersection<
					{
						[K in keyof Registrations]: Registrations[K] extends HaneulClientRegistration<
							this,
							infer Name extends string,
							infer Extension
						>
							? {
									[K2 in Name]: Extension;
								}
							: never;
					}[number]
				>
			>,
			this
		>;
	}
}
