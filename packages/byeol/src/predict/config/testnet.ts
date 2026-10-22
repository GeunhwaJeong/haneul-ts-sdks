// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { TESTNET_PREDICT } from '../../deployments/testnet.js';
import type { PredictConfig } from './types.js';

/**
 * Testnet deployment constants, read from the shared generated record in
 * `src/deployments/` rather than transcribed here. `/account` and `/sessions` read slices of
 * that same record, so a redeploy (`pnpm sync-deployment`) moves every subpath together and
 * they cannot end up addressing different deployments.
 *
 * The record is generated from the deploy tooling's `deployment.testnet.json`; see
 * `scripts/sync-deployment.ts`. `getDeployment('testnet')` names the deployment and the
 * byeolv3 commit these ids came from.
 */
export const TESTNET_CONFIG: PredictConfig = Object.freeze({
	// The record widens `network` to `string` so the published types don't pin a literal;
	// this file is the testnet config by construction.
	network: 'testnet',
	// Delayed execution (DBU-885) is recorded on Testnet. The generated record carries the package
	// IDs that move with upgrades (Predict, `byeol_predict_orders`, `byeol_predict_math`) and
	// the Lazer `State`. The three IDs pinned below are in no publication record and never move:
	// the Predict version that introduced delayed execution (Testnet v5), which defines its new
	// types and events, and the `OrderDesk` and `QueueRegistry` that `byeol_predict_orders`'s
	// `init` shared at publish.
	packages: Object.freeze({
		...TESTNET_PREDICT.packages,
		predictDelayedExecution: '0x0000000000000000000000000000000000000000000000000000000000000000',
	}),
	objects: Object.freeze({
		...TESTNET_PREDICT.objects,
		orderDesk: '0x0000000000000000000000000000000000000000000000000000000000000000',
		queueRegistry: '0x0000000000000000000000000000000000000000000000000000000000000000',
	}),
	quoteCoinType: TESTNET_PREDICT.quoteCoinType,
	coinTypes: TESTNET_PREDICT.coinTypes,
	units: TESTNET_PREDICT.units,
	underlyings: TESTNET_PREDICT.underlyings,
	oracle: TESTNET_PREDICT.oracle,
});
