// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { createDAppKit } from '@haneullabs/dapp-kit-react';
import { HaneulGrpcClient } from '@haneullabs/haneul/grpc';

const GRPC_URLS = {
	mainnet: 'https://fullnode.mainnet.haneul.io:443',
	testnet: 'https://fullnode.testnet.haneul.io:443',
} as const;

export const dAppKit = createDAppKit({
	enableBurnerWallet: process.env.NODE_ENV === 'development',
	networks: ['mainnet', 'testnet'],
	defaultNetwork: 'testnet',
	createClient(network) {
		return new HaneulGrpcClient({ network, baseUrl: GRPC_URLS[network] });
	},
});

// global type registration necessary for the hooks to work correctly
declare module '@haneullabs/dapp-kit-react' {
	interface Register {
		dAppKit: typeof dAppKit;
	}
}
