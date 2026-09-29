// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { openTransportReplayer, RecordStore } from '@ledgerhq/hw-transport-mocker';
import { expect, test } from 'vitest';

import Haneul from '../src/Haneul.js';
import { LatestFirmwareVersionRequired, UpdateYourApp } from '../src/errors.js';

test('Haneul init', async () => {
	const transport = await openTransportReplayer(RecordStore.fromString(''));
	const pkt = new Haneul(transport);
	expect(pkt).not.toBe(undefined);
});

test('preserves the observable Ledger error shape', () => {
	const firmwareError = new LatestFirmwareVersionRequired('LatestFirmwareVersionRequired');
	const appError = new UpdateYourApp(undefined, { managerAppName: 'Haneul' });

	expect(firmwareError).toBeInstanceOf(Error);
	expect(firmwareError).toMatchObject({
		name: 'LatestFirmwareVersionRequired',
		message: 'LatestFirmwareVersionRequired',
	});
	expect(appError).toBeInstanceOf(Error);
	expect(appError).toMatchObject({
		name: 'UpdateYourApp',
		message: 'UpdateYourApp',
		managerAppName: 'Haneul',
	});
});
