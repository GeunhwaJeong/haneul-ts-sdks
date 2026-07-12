// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { createDAppKit } from '@haneullabs/dapp-kit-core';
import { HaneulGrpcClient } from '@haneullabs/haneul/grpc';

import '@haneullabs/dapp-kit-core/web';

const GRPC_URLS = {
	mainnet: 'http://158.69.54.239:9000',
	testnet: 'https://fullnode.testnet.haneul.io:443',
};

const connectButton = document.querySelector('haneullabs-dapp-kit-connect-button');

const dAppKit = createDAppKit({
	enableBurnerWallet: import.meta.env.DEV,
	networks: ['mainnet', 'testnet'],
	defaultNetwork: 'testnet',
	createClient(network) {
		return new HaneulGrpcClient({ network, baseUrl: GRPC_URLS[network] });
	},
});

connectButton!.instance = dAppKit;
