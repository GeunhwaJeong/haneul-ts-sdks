// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from 'vitest';
import { SessionKey } from '../../src/session-key';
import { Ed25519Keypair } from '@haneullabs/sui/keypairs/ed25519';
import { UserError } from '../../src/error';
import { getFullnodeUrl, HaneulClient } from '@haneullabs/sui/client';

describe('Session key tests', () => {
	const TESTNET_PACKAGE_ID = '0x9709d4ee371488c2bc09f508e98e881bd1d5335e0805d7e6a99edd54a7027954';
	it('import and export session key', async () => {
		const kp = Ed25519Keypair.generate();
		const haneulClient = new HaneulClient({ url: getFullnodeUrl('testnet') });
		const sessionKey = await SessionKey.create({
			address: kp.getPublicKey().toHaneulAddress(),
			packageId: TESTNET_PACKAGE_ID,
			ttlMin: 1,
			haneulClient,
		});
		const sig = await kp.signPersonalMessage(sessionKey.getPersonalMessage());
		await sessionKey.setPersonalMessageSignature(sig.signature);

		const exportedSessionKey = sessionKey.export();
		const restoredSessionKey = await SessionKey.import(exportedSessionKey, haneulClient);

		expect(restoredSessionKey.getAddress()).toBe(kp.getPublicKey().toHaneulAddress());
		expect(restoredSessionKey.getPackageId()).toBe(TESTNET_PACKAGE_ID);
		expect(restoredSessionKey.export().sessionKey).toBe(sessionKey.export().sessionKey);
		expect(restoredSessionKey.getPersonalMessage()).toEqual(sessionKey.getPersonalMessage());

		// invalid signer
		const kp2 = Ed25519Keypair.generate();
		expect(() =>
			SessionKey.import(
				{
					address: kp.getPublicKey().toHaneulAddress(),
					packageId: TESTNET_PACKAGE_ID,
					ttlMin: 1,
					sessionKey: sessionKey.export().sessionKey,
					creationTimeMs: sessionKey.export().creationTimeMs,
					personalMessageSignature: sig.signature,
				},
				haneulClient,
				kp2,
			),
		).toThrow(UserError);
	});
});
