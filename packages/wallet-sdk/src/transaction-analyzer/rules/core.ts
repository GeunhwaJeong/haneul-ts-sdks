// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { Transaction } from '@haneullabs/haneul/transactions';
import { TransactionDataBuilder } from '@haneullabs/haneul/transactions';
import type { ClientWithCoreApi, HaneulClientTypes } from '@haneullabs/haneul/client';
import type { AnalyzerResult } from '../analyzer.js';
import { createAnalyzer } from '../analyzer.js';

export const bytes = createAnalyzer({
	cacheKey: 'bytes@1.0.0',
	analyze:
		(options: { client: ClientWithCoreApi }, transaction: Transaction) =>
		async (): Promise<AnalyzerResult<Uint8Array>> => {
			try {
				return {
					result: await transaction.build({ client: options.client }),
				};
			} catch {
				return { issues: [{ message: 'Failed to build transaction' }] };
			}
		},
});

export const data = createAnalyzer({
	dependencies: { bytes },
	analyze: (_, tx) => () => {
		return { result: tx.getData() };
	},
});

export const digest = createAnalyzer({
	dependencies: { bytes },
	analyze:
		() =>
		({ bytes }) => {
			return { result: TransactionDataBuilder.getDigestFromBytes(bytes) };
		},
});

export const transactionResponse = createAnalyzer({
	cacheKey: 'transactionResponse@1.0.0',
	dependencies: { bytes },
	analyze:
		(options: { client: ClientWithCoreApi; transactionResponse?: HaneulClientTypes.Transaction }) =>
		async ({ bytes }): Promise<AnalyzerResult<HaneulClientTypes.Transaction>> => {
			try {
				const result = await options.client.core.simulateTransaction({ transaction: bytes });
				return {
					result: options.transactionResponse ?? result.Transaction ?? result.FailedTransaction,
				};
			} catch {
				return { issues: [{ message: 'Failed to dry run transaction' }] };
			}
		},
});

export const balanceChanges = createAnalyzer({
	dependencies: { transactionResponse },
	analyze:
		() =>
		({ transactionResponse }) => {
			return { result: transactionResponse.balanceChanges || [] };
		},
});
