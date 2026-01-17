// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { MoveTuple } from '../../../utils/index.js';
import { bcs } from '@haneullabs/sui/bcs';
const $moduleName = 'haneulns::pricing_config';
export const Range = new MoveTuple({
	name: `${$moduleName}::Range`,
	fields: [bcs.u64(), bcs.u64()],
});
