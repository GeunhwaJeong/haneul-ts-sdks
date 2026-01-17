// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

export const HaneulGetCapabilities = 'sui:getCapabilities';

/** The latest API version of the getCapabilities API. */
export type HaneulGetCapabilitiesVersion = '1.0.0';

/**
 * A Wallet Standard feature for reporting intents supported by the wallet.
 */
export type HaneulGetCapabilitiesFeature = {
	[HaneulGetCapabilities]: {
		version: HaneulGetCapabilitiesVersion;
		getCapabilities: HaneulGetCapabilitiesMethod;
	};
};

export type HaneulGetCapabilitiesMethod = () => Promise<{
	supportedIntents?: string[];
}>;
