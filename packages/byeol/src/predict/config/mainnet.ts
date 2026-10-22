// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { MAINNET_PREDICT } from '../../deployments/mainnet.js';
import type { PredictConfig } from './types.js';

/**
 * Mainnet deployment constants, read from the shared generated record in
 * `src/deployments/` rather than transcribed here. `/account` and `/sessions` read slices of
 * that same record, so a redeploy (`pnpm sync-deployment`) moves every subpath together and
 * they cannot end up addressing different deployments.
 *
 * The record is generated from the deploy tooling's `deployment.mainnet.json`; see
 * `scripts/sync-deployment.ts`. `getDeployment('mainnet')` names the deployment and the
 * byeolv3 commit these ids came from.
 */
export const MAINNET_CONFIG: PredictConfig = Object.freeze({
	// The record widens `network` to `string` so the published types don't pin a literal;
	// this file is the mainnet config by construction.
	network: 'mainnet',
	// Delayed execution (DBU-885) is recorded on Mainnet. The generated record carries the package
	// IDs that move with upgrades (Predict, `byeol_predict_orders`, `byeol_predict_math`) and
	// the Lazer `State`. The three IDs pinned below are in no publication record and never move:
	// the Predict version that introduced delayed execution (Mainnet v4), which defines its new
	// types and events, and the `OrderDesk` and `QueueRegistry` that `byeol_predict_orders`'s
	// `init` shared at publish.
	packages: Object.freeze({
		...MAINNET_PREDICT.packages,
		predictDelayedExecution: '0x0000000000000000000000000000000000000000000000000000000000000000',
	}),
	objects: Object.freeze({
		...MAINNET_PREDICT.objects,
		orderDesk: '0x0000000000000000000000000000000000000000000000000000000000000000',
		queueRegistry: '0x0000000000000000000000000000000000000000000000000000000000000000',
	}),
	quoteCoinType: MAINNET_PREDICT.quoteCoinType,
	coinTypes: MAINNET_PREDICT.coinTypes,
	units: MAINNET_PREDICT.units,
	underlyings: MAINNET_PREDICT.underlyings,
	oracle: MAINNET_PREDICT.oracle,
});
