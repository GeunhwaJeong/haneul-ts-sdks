// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { WalletAccount } from '@wallet-standard/core';

/**
 * Name of the feature.
 * @deprecated Wallets can still implement this method for compatibility, but this has been replaced by the `sui:signPersonalMessage` feature
 **/
export const HaneulSignMessage = 'sui:signMessage';

/**
 * The latest API version of the signMessage API.
 * @deprecated Wallets can still implement this method for compatibility, but this has been replaced by the `sui:signPersonalMessage` feature
 */
export type HaneulSignMessageVersion = '1.0.0';

/**
 * A Wallet Standard feature for signing a personal message, and returning the
 * message bytes that were signed, and message signature.
 *
 * @deprecated Wallets can still implement this method for compatibility, but this has been replaced by the `sui:signPersonalMessage` feature
 */
export type HaneulSignMessageFeature = {
	/** Namespace for the feature. */
	[HaneulSignMessage]: {
		/** Version of the feature API. */
		version: HaneulSignMessageVersion;
		signMessage: HaneulSignMessageMethod;
	};
};

/** @deprecated Wallets can still implement this method for compatibility, but this has been replaced by the `sui:signPersonalMessage` feature */
export type HaneulSignMessageMethod = (input: HaneulSignMessageInput) => Promise<HaneulSignMessageOutput>;

/**
 * Input for signing messages.
 * @deprecated Wallets can still implement this method for compatibility, but this has been replaced by the `sui:signPersonalMessage` feature
 */
export interface HaneulSignMessageInput {
	message: Uint8Array;
	account: WalletAccount;
}

/**
 * Output of signing messages.
 * @deprecated Wallets can still implement this method for compatibility, but this has been replaced by the `sui:signPersonalMessage` feature
 */
export interface HaneulSignMessageOutput {
	/** Base64 message bytes. */
	messageBytes: string;
	/** Base64 encoded signature */
	signature: string;
}
