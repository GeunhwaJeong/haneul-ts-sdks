// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/** Sui object identifiers */

import { MoveStruct } from '../../../utils/index.js';
import { bcs } from '@haneullabs/sui/bcs';
const $moduleName = '0x2::object';
export const UID = new MoveStruct({
	name: `${$moduleName}::UID`,
	fields: {
		id: bcs.Address,
	},
});
