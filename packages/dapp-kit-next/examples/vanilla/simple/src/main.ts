// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { createDAppKit } from '@haneullabs/dapp-kit-core';
import { getFullnodeUrl, SuiClient } from '@haneullabs/sui/client';

import '@haneullabs/dapp-kit-core/web';

const connectButton = document.querySelector('haneullabs-dapp-kit-connect-button');

const dAppKit = createDAppKit({
	enableBurnerWallet: import.meta.env.DEV,
	networks: ['mainnet', 'testnet'],
	defaultNetwork: 'testnet',
	createClient(network) {
		return new SuiClient({ network, url: getFullnodeUrl(network) });
	},
});

connectButton!.instance = dAppKit;
