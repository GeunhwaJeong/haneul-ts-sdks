// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { DAppKitProvider } from '@haneullabs/dapp-kit-react';
import { ConnectButton } from '@haneullabs/dapp-kit-react/ui';
import { dAppKit } from './dApp-kit.ts';

export default function ClientOnlyConnectButton() {
	return (
		<DAppKitProvider dAppKit={dAppKit}>
			<ConnectButton />
		</DAppKitProvider>
	);
}
