// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { normalizeHaneulObjectId } from './haneul-types.js';

export const SUI_DECIMALS = 9;
export const GEUNHWA_PER_HANEUL = BigInt(1000000000);

export const MOVE_STDLIB_ADDRESS = '0x1';
export const HANEUL_FRAMEWORK_ADDRESS = '0x2';
export const HANEUL_SYSTEM_ADDRESS = '0x3';
export const SUI_CLOCK_OBJECT_ID = normalizeHaneulObjectId('0x6');
export const SUI_SYSTEM_MODULE_NAME = 'haneul_system';
export const SUI_TYPE_ARG = `${HANEUL_FRAMEWORK_ADDRESS}::haneul::HANEUL`;
export const HANEUL_SYSTEM_STATE_OBJECT_ID: string = normalizeHaneulObjectId('0x5');
export const SUI_RANDOM_OBJECT_ID = normalizeHaneulObjectId('0x8');
