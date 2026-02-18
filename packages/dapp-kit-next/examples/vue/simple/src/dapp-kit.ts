// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { createDAppKit } from '@haneullabs/dapp-kit-core';
import { HaneulGrpcClient } from '@haneullabs/haneul/grpc';

const GRPC_URLS = {
	mainnet: 'https://fullnode.mainnet.haneul.io:443',
	testnet: 'https://fullnode.testnet.haneul.io:443',
};

export const dAppKit = createDAppKit({
	enableBurnerWallet: import.meta.env.DEV,
	networks: ['mainnet', 'testnet'],
	defaultNetwork: 'testnet',
	createClient(network) {
		return new HaneulGrpcClient({ network, baseUrl: GRPC_URLS[network] });
	},
});
