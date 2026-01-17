// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { createDAppKit } from '@haneullabs/dapp-kit-react';
import { getFullnodeUrl, SuiClient } from '@haneullabs/sui/client';

export const dAppKit = createDAppKit({
	enableBurnerWallet: process.env.NODE_ENV === 'development',
	networks: ['mainnet', 'testnet'],
	defaultNetwork: 'testnet',
	createClient(network) {
		return new SuiClient({ network, url: getFullnodeUrl(network) });
	},
});

declare module '@haneullabs/dapp-kit-react' {
	interface Register {
		dAppKit: typeof dAppKit;
	}
}
