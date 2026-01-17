// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

export { formatAddress, formatDigest } from './format.js';
export {
	isValidHaneulAddress,
	isValidHaneulObjectId,
	isValidTransactionDigest,
	normalizeStructTag,
	normalizeHaneulAddress,
	normalizeHaneulObjectId,
	parseStructTag,
	SUI_ADDRESS_LENGTH,
} from './haneul-types.js';

export {
	fromB64,
	toB64,
	fromHEX,
	toHex,
	toHEX,
	fromHex,
	fromBase64,
	toBase64,
	fromBase58,
	toBase58,
} from '@haneullabs/bcs';
export { isValidHaneulNSName, normalizeHaneulNSName } from './haneulns.js';

export {
	SUI_DECIMALS,
	GEUNHWA_PER_HANEUL,
	MOVE_STDLIB_ADDRESS,
	SUI_FRAMEWORK_ADDRESS,
	SUI_SYSTEM_ADDRESS,
	SUI_CLOCK_OBJECT_ID,
	SUI_SYSTEM_MODULE_NAME,
	SUI_TYPE_ARG,
	SUI_SYSTEM_STATE_OBJECT_ID,
	SUI_RANDOM_OBJECT_ID,
} from './constants.js';

export { isValidNamedPackage, isValidNamedType } from './move-registry.js';

export { deriveDynamicFieldID } from './dynamic-fields.js';

export { deriveObjectID } from './derived-objects.js';
export { normalizeTypeTag } from '../bcs/type-tag-serializer.js';
