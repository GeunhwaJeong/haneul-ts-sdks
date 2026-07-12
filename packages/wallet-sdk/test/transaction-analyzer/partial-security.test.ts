// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from 'vitest';
import { Transaction } from '@haneullabs/haneul/transactions';
import { normalizeHaneulAddress } from '@haneullabs/haneul/utils';

import { analyze, createAnalyzer } from '../../src/transaction-analyzer/analyzer.js';
import { commands } from '../../src/transaction-analyzer/rules/commands.js';
import { data } from '../../src/transaction-analyzer/rules/core.js';
import { MockHaneulClient } from '../mocks/MockHaneulClient.js';
import { DEFAULT_SENDER } from '../mocks/mockData.js';

const BLOCKED_PACKAGE = normalizeHaneulAddress('0xbad');

const blockedMoveCallChecks = createAnalyzer({
	cacheKey: 'test-blocked-move-call-checks',
	dependencies: { data },
	analyze:
		() =>
		({ data }) => {
			return {
				result: data.commands.flatMap((command) => {
					if (
						command.$kind !== 'MoveCall' ||
						normalizeHaneulAddress(command.MoveCall.package) !== BLOCKED_PACKAGE
					) {
						return [];
					}
					return [
						{
							code: 'BLOCKED_PACKAGE',
							target: `${command.MoveCall.package}::${command.MoveCall.module}::${command.MoveCall.function}`,
						},
					];
				}),
			};
		},
});

describe('transaction analyzer partial security results', () => {
	it('returns independent static findings when unrelated enrichment fails', async () => {
		const client = new MockHaneulClient();
		const tx = new Transaction();
		tx.setSender(DEFAULT_SENDER);
		tx.moveCall({
			target: `${BLOCKED_PACKAGE}::blocked::entry`,
		});

		const results = await analyze(
			{ blockedMoveCallChecks, commands },
			{
				client,
				transaction: await tx.toJSON(),
			},
		);

		expect(results.status).toBe('partial');
		expect(results.blockedMoveCallChecks.status).toBe('success');
		expect(results.blockedMoveCallChecks.result).toEqual([
			{
				code: 'BLOCKED_PACKAGE',
				target: `${BLOCKED_PACKAGE}::blocked::entry`,
			},
		]);
		expect(results.commands.status).toBe('skipped');
		expect(results.commands.issues?.some((issue) => issue.message.includes(BLOCKED_PACKAGE))).toBe(
			true,
		);
	});
});
