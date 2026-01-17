// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { bcs } from '@haneullabs/sui/bcs';
import { deriveObjectID } from '@haneullabs/sui/utils';
import { DEFAULT_REGISTRY_NAME } from './constants.js';

export const getRegistryIdFromName = (
	registryName: string = DEFAULT_REGISTRY_NAME,
	namespaceId: string,
) => {
	return deriveObjectID(
		namespaceId,
		'0x1::ascii::String',
		bcs.String.serialize(registryName).toBytes(),
	);
};
