// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { HaneulClientTypes } from '@haneullabs/haneul/client';
import type { TransactionObjectArgument } from '@haneullabs/haneul/transactions';

import type { BaseRulePackageIds } from '../constants.js';
import { HaneulJsonRpcClient } from '@haneullabs/haneul/jsonRpc';
import { HaneulGraphQLClient } from '@haneullabs/haneul/graphql';

export * from './kiosk.js';
export * from './transfer-policy.js';

/**
 * A valid argument for any of the Kiosk functions.
 */
export type ObjectArgument = string | TransactionObjectArgument;

/**
 * The Client Options for Both KioskClient & TransferPolicyManager.
 */
export type KioskClientOptions = {
	client: KioskCompatibleClient;
	network: HaneulClientTypes.Network;
	packageIds?: BaseRulePackageIds;
};

export type KioskCompatibleClient = HaneulJsonRpcClient | HaneulGraphQLClient;
