// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { IdentifierString, WalletAccount } from '@wallet-standard/core';

/** Name of the feature. */
export const HaneulReportTransactionEffects = 'sui:reportTransactionEffects';

/** The latest API version of the reportTransactionEffects API. */
export type HaneulReportTransactionEffectsVersion = '1.0.0';

/**
 * A Wallet Standard feature for reporting the effects of a transaction block executed by a dapp
 * The feature allows wallets to updated their caches using the effects of the transaction
 * executed outside of the wallet
 */
export type HaneulReportTransactionEffectsFeature = {
	/** Namespace for the feature. */
	[HaneulReportTransactionEffects]: {
		/** Version of the feature API. */
		version: HaneulReportTransactionEffectsVersion;
		reportTransactionEffects: HaneulReportTransactionEffectsMethod;
	};
};

export type HaneulReportTransactionEffectsMethod = (
	input: HaneulReportTransactionEffectsInput,
) => Promise<void>;

/** Input for signing transactions. */
export interface HaneulReportTransactionEffectsInput {
	account: WalletAccount;
	chain: IdentifierString;
	/** Transaction effects as base64 encoded bcs. */
	effects: string;
}
