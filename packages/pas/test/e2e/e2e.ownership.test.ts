// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { HaneulClientTypes } from '@haneullabs/haneul/client';
import { normalizeHaneulAddress } from '@haneullabs/haneul/utils';
import { describe, expect, it } from 'vitest';

import { Field } from '../../src/contracts/haneul/dynamic_field.js';
import { TypeName } from '../../src/contracts/pas/deps/std/type_name.js';
import { Command, MoveCall } from '../../src/contracts/ptb/ptb.js';
import { InvalidObjectOwnershipError } from '../../src/error.js';
import { validateTemplateObjects } from '../../src/intents.js';
import { getClient, setupToolbox } from './setup.js';

type HaneulObject = HaneulClientTypes.Object<{ content: true }>;

/**
 * Builds a fake template DF object whose command references the given
 * object IDs via `object_by_id` extensions. No on-chain publish needed.
 */
function buildFakeTemplate(objectIds: string[]): HaneulObject {
	const args = objectIds.map((id) => ({
		Input: {
			Object: { Ext: `object_by_id:${normalizeHaneulAddress(id)}` },
		},
	}));

	const moveCallBytes = MoveCall.serialize({
		package_id: normalizeHaneulAddress('0x1'),
		module_name: 'fake',
		function: 'fake',
		arguments: args as any,
		type_arguments: [],
	}).toBytes();

	const FieldType = Field(TypeName, Command);
	const content = FieldType.serialize({
		id: normalizeHaneulAddress('0x0'),
		name: { name: 'fake::FakeApproval' },
		value: [0, [...moveCallBytes]] as any,
	}).toBytes();

	return {
		objectId: normalizeHaneulAddress('0x0'),
		version: '0',
		digest: '',
		owner: { $kind: 'Shared', Shared: { initialSharedVersion: '0' } },
		type: '',
		content,
		previousTransaction: undefined,
		objectBcs: undefined,
		json: undefined,
	} as unknown as HaneulObject;
}

describe('template object ownership validation', () => {
	it('rejects templates referencing address-owned objects', async () => {
		const toolbox = await setupToolbox();
		const client = getClient();

		const { objects: coins } = await client.listCoins({ owner: toolbox.address() });
		expect(coins.length).toBeGreaterThan(0);
		const ownedObjectId = coins[0].objectId;

		const template = buildFakeTemplate([ownedObjectId]);

		await expect(validateTemplateObjects(client, [template])).rejects.toThrow(
			InvalidObjectOwnershipError,
		);
	});

	it('accepts templates referencing shared and immutable objects', async () => {
		const toolbox = await setupToolbox();
		const client = getClient();
		const namespaceId = toolbox.client.pas.getPackageConfig().namespaceId;
		// 0x2 is the Haneul framework package -- always immutable.
		const haneulFrameworkId = normalizeHaneulAddress('0x2');

		const template = buildFakeTemplate([namespaceId, haneulFrameworkId]);

		await expect(validateTemplateObjects(client, [template])).resolves.not.toThrow();
	});
});
