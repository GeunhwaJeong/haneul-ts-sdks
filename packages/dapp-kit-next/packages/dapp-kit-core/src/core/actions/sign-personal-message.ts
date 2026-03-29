// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { DAppKitStores } from '../store.js';
import { HaneulSignPersonalMessage } from '@haneullabs/wallet-standard';
import type {
	HaneulSignPersonalMessageFeature,
	HaneulSignPersonalMessageInput,
} from '@haneullabs/wallet-standard';
import { getWalletAccountForUiWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED as getWalletAccountForUiWalletAccount } from '@wallet-standard/ui-registry';
import { WalletNotConnectedError } from '../../utils/errors.js';
import { getChain } from '../../utils/networks.js';
import { getAccountFeature } from '../../utils/wallets.js';

export type SignPersonalMessageArgs = Omit<HaneulSignPersonalMessageInput, 'account' | 'chain'>;

export function signPersonalMessageCreator({ $connection, $currentNetwork }: DAppKitStores) {
	/**
	 * Prompts the specified wallet account to sign a personal message.
	 */
	return async function signPersonalMessage({ ...standardArgs }: SignPersonalMessageArgs) {
		const { account } = $connection.get();
		if (!account) {
			throw new WalletNotConnectedError('No wallet is connected.');
		}

		const currentNetwork = $currentNetwork.get();
		const chain = getChain(currentNetwork);

		const signPersonalMessageFeature = getAccountFeature({
			account: account,
			chain,
			featureName: HaneulSignPersonalMessage,
		}) as HaneulSignPersonalMessageFeature[typeof HaneulSignPersonalMessage];

		return await signPersonalMessageFeature.signPersonalMessage({
			...standardArgs,
			account: getWalletAccountForUiWalletAccount(account),
			chain,
		});
	};
}
