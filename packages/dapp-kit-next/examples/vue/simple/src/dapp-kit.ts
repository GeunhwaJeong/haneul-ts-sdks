// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { createDAppKit } from '@haneullabs/dapp-kit-core';
import { getFullnodeUrl, HaneulClient } from '@haneullabs/haneul/client';

export const dAppKit = createDAppKit({
	enableBurnerWallet: import.meta.env.DEV,
	networks: ['mainnet', 'testnet'],
	defaultNetwork: 'testnet',
	createClient(network) {
		return new HaneulClient({ network, url: getFullnodeUrl(network) });
	},
});
