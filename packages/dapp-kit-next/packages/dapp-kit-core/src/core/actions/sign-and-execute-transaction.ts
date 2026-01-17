// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { DAppKitStores } from '../store.js';
import {
	HaneulSignAndExecuteTransaction,
	HaneulSignAndExecuteTransactionBlock,
} from '@haneullabs/wallet-standard';
import type {
	HaneulSignAndExecuteTransactionBlockFeature,
	HaneulSignAndExecuteTransactionFeature,
	HaneulSignAndExecuteTransactionInput,
} from '@haneullabs/wallet-standard';
import { getWalletAccountForUiWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED as getWalletAccountForUiWalletAccount } from '@wallet-standard/ui-registry';
import { FeatureNotSupportedError, WalletNotConnectedError } from '../../utils/errors.js';
import { getChain } from '../../utils/networks.js';
import { Transaction } from '@haneullabs/sui/transactions';
import { tryGetAccountFeature } from '../../utils/wallets.js';
import { bcs } from '@haneullabs/sui/bcs';
import { fromBase64, toBase64 } from '@haneullabs/utils';

export type SignAndExecuteTransactionArgs = {
	transaction: Transaction | string;
} & Omit<HaneulSignAndExecuteTransactionInput, 'account' | 'chain' | 'transaction'>;

export function signAndExecuteTransactionCreator({ $connection, $currentClient }: DAppKitStores) {
	/**
	 * Prompts the specified wallet account to sign and execute a transaction.
	 */
	return async function signAndExecuteTransaction({
		transaction,
		...standardArgs
	}: SignAndExecuteTransactionArgs) {
		const { account, supportedIntents } = $connection.get();
		if (!account) {
			throw new WalletNotConnectedError('No wallet is connected.');
		}

		const underlyingAccount = getWalletAccountForUiWalletAccount(account);
		const haneulClient = $currentClient.get();
		const chain = getChain(haneulClient.network);

		const transactionWrapper = {
			toJSON: async () => {
				if (typeof transaction === 'string') {
					return transaction;
				}

				transaction.setSenderIfNotSet(account.address);
				return await transaction.toJSON({ client: haneulClient, supportedIntents });
			},
		};

		const signAndExecuteTransactionFeature = tryGetAccountFeature({
			account,
			chain,
			featureName: HaneulSignAndExecuteTransaction,
		}) as HaneulSignAndExecuteTransactionFeature[typeof HaneulSignAndExecuteTransaction];

		if (signAndExecuteTransactionFeature) {
			return await signAndExecuteTransactionFeature.signAndExecuteTransaction({
				...standardArgs,
				account: underlyingAccount,
				transaction: transactionWrapper,
				chain,
			});
		}

		const signAndExecuteTransactionBlockFeature = tryGetAccountFeature({
			account,
			chain,
			featureName: HaneulSignAndExecuteTransactionBlock,
		}) as HaneulSignAndExecuteTransactionBlockFeature[typeof HaneulSignAndExecuteTransactionBlock];

		if (signAndExecuteTransactionBlockFeature) {
			const transactionBlock = Transaction.from(await transactionWrapper.toJSON());
			const { digest, rawEffects, rawTransaction } =
				await signAndExecuteTransactionBlockFeature.signAndExecuteTransactionBlock({
					account,
					chain,
					transactionBlock,
					options: {
						showRawEffects: true,
						showRawInput: true,
					},
				});

			const [
				{
					txSignatures: [signature],
					intentMessage: { value: bcsTransaction },
				},
			] = bcs.SenderSignedData.parse(fromBase64(rawTransaction!));

			const bytes = bcs.TransactionData.serialize(bcsTransaction).toBase64();

			return {
				digest,
				signature,
				bytes,
				effects: toBase64(new Uint8Array(rawEffects!)),
			};
		}

		throw new FeatureNotSupportedError(
			`The account ${account.address} does not support signing and executing transactions.`,
		);
	};
}
