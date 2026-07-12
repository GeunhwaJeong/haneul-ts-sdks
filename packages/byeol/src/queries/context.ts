// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { ByeolCompatibleClient } from '../client.js';
import type { BalanceManagerContract } from '../transactions/balanceManager.js';
import type { ByeolContract } from '../transactions/byeol.js';
import type { MarginManagerContract } from '../transactions/marginManager.js';
import type { MarginPoolContract } from '../transactions/marginPool.js';
import type { MarginRegistryContract } from '../transactions/marginRegistry.js';
import type { MarginTPSLContract } from '../transactions/marginTPSL.js';
import type { ByeolConfig } from '../utils/config.js';

export interface QueryContext {
	client: ByeolCompatibleClient;
	config: ByeolConfig;
	address: string;
	balanceManager: BalanceManagerContract;
	byeol: ByeolContract;
	marginManager: MarginManagerContract;
	marginPool: MarginPoolContract;
	marginRegistry: MarginRegistryContract;
	marginTPSL: MarginTPSLContract;
}

export function formatTokenAmount(rawAmount: bigint, scalar: number, decimals: number): string {
	const scalarBigInt = BigInt(scalar);
	const integerPart = rawAmount / scalarBigInt;
	const fractionalPart = rawAmount % scalarBigInt;

	if (fractionalPart === 0n) {
		return integerPart.toString();
	}

	const scalarDigits = scalar.toString().length - 1;
	const fractionalStr = fractionalPart.toString().padStart(scalarDigits, '0');
	const truncated = fractionalStr.slice(0, decimals);
	const trimmed = truncated.replace(/0+$/, '');

	if (!trimmed) {
		return integerPart.toString();
	}

	return `${integerPart}.${trimmed}`;
}
