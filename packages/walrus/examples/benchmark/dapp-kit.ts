// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { createDAppKit } from '@haneullabs/dapp-kit-react';
import { HaneulGrpcClient } from '@haneullabs/haneul/grpc';
import { walrus } from '../../src/index.js';

const GRPC_URLS = {
	testnet: 'https://fullnode.testnet.haneul.io:443',
} as const;

export const dAppKit = createDAppKit({
	networks: ['testnet'],
	defaultNetwork: 'testnet',
	autoConnect: true,
	createClient(network) {
		return new HaneulGrpcClient({ network, baseUrl: GRPC_URLS[network] }).$extend(
			walrus({
				name: 'walrusWithRelay',

				storageNodeClientOptions: {
					timeout: 600_000,
					onError: (error) => {
						console.error('Storage node client error:', error);
					},
				},
				uploadRelay: {
					host: 'https://upload-relay.testnet.walrus.space',
					sendTip: {
						max: 1_000,
					},
					timeout: 600_000,
				},
			}),
			walrus({
				name: 'walrusWithoutRelay',
				storageNodeClientOptions: {
					timeout: 600_000,
				},
			}),
		);
	},
});

declare module '@haneullabs/dapp-kit-react' {
	interface Register {
		dAppKit: typeof dAppKit;
	}
}
