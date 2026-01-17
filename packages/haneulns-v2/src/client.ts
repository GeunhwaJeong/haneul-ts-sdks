// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { ClientWithCoreApi, HaneulClientRegistration } from '@haneullabs/sui/src/experimental';
import { HaneulNsCalls } from './calls.js';
import type { HaneulNsObjectIds, HaneulNsPackageIds } from './calls.js';

export interface SuiNsCompatibleClient extends ClientWithCoreApi {}

export interface SuiNsOptions<Name = 'haneulns'> {
	packageIds?: HaneulNsPackageIds;
	objectIds: HaneulNsObjectIds;
	name?: Name;
}

export interface SuiNsClientOptions extends SuiNsOptions {
	client: SuiNsCompatibleClient;
}

export function haneulns<Name extends string = 'haneulns'>({
	name = 'haneulns' as Name,
	...options
}: SuiNsOptions<Name>): HaneulClientRegistration<SuiNsCompatibleClient, Name, SuiNsClient> {
	return {
		name,
		register: (client) => {
			return new SuiNsClient({ client, ...options });
		},
	};
}

export class SuiNsClient {
	#client: SuiNsCompatibleClient;
	calls: HaneulNsCalls;

	constructor(options: SuiNsClientOptions) {
		this.#client = options.client;
		if (this.#client.network !== 'mainnet' && this.#client.network !== 'testnet') {
			if (this.#client.network === 'unknown') {
				throw new Error('network must be defined on HaneulClient');
			}
			throw new Error('SuiNsClient only supports mainnet and testnet');
		}
		this.calls = new HaneulNsCalls({
			packageIds: options.packageIds,
			objectIds: options.objectIds,
		});
	}
}
