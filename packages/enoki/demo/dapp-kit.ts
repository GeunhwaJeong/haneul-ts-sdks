// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { createDAppKit } from '@haneullabs/dapp-kit-react';
import { HaneulGrpcClient } from '@haneullabs/haneul/grpc';

const GRPC_URLS = {
	testnet: 'https://fullnode.testnet.haneul.io:443',
	localnet: 'http://localhost:8000',
};

export const dAppKit = createDAppKit({
	networks: ['testnet', 'localnet'],
	defaultNetwork: 'testnet',
	createClient(network) {
		return new HaneulGrpcClient({ network, baseUrl: GRPC_URLS[network] });
	},
});

declare module '@haneullabs/dapp-kit-react' {
	interface Register {
		dAppKit: typeof dAppKit;
	}
}
