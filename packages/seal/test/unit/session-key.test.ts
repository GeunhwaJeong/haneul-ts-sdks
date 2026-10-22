// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from 'vitest';
import { SessionKey } from '../../src/session-key.js';
import { Ed25519Keypair } from '@haneullabs/haneul/keypairs/ed25519';
import { HaneulGrpcClient } from '@haneullabs/haneul/grpc';
import { getJsonRpcFullnodeUrl } from '@haneullabs/haneul/jsonRpc';
import { verifyPersonalMessageSignature } from '@haneullabs/haneul/verify';

describe('Session key tests', () => {
	const TESTNET_PACKAGE_ID = '0x9709d4ee371488c2bc09f508e98e881bd1d5335e0805d7e6a99edd54a7027954';
	it('import and export session key', async () => {
		const kp = Ed25519Keypair.generate();
		const haneulClient = new HaneulGrpcClient({
			network: 'testnet',
			baseUrl: getJsonRpcFullnodeUrl('testnet'),
		});
		const sessionKey = await SessionKey.create({
			address: kp.getPublicKey().toHaneulAddress(),
			packageId: TESTNET_PACKAGE_ID,
			ttlMin: 1,
			haneulClient,
		});
		const sig = await kp.signPersonalMessage(sessionKey.getPersonalMessage());
		await sessionKey.setPersonalMessageSignature(sig.signature);

		const exportedSessionKey = sessionKey.export();
		const restoredSessionKey = SessionKey.import(exportedSessionKey, haneulClient);

		expect(restoredSessionKey.getAddress()).toBe(kp.getPublicKey().toHaneulAddress());
		expect(restoredSessionKey.getPackageId()).toBe(TESTNET_PACKAGE_ID);
		expect(restoredSessionKey.export().sessionKey).toBe(sessionKey.export().sessionKey);
		expect(restoredSessionKey.getPersonalMessage()).toEqual(sessionKey.getPersonalMessage());

		// A signer may differ from the canonical address when it is an address alias.
		const kp2 = Ed25519Keypair.generate();
		const restoredWithAliasSigner = SessionKey.import(
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
		);
		expect(restoredWithAliasSigner.getAddress()).toBe(kp.getPublicKey().toHaneulAddress());

		const sessionWithAliasSigner = await SessionKey.create({
			address: kp.getPublicKey().toHaneulAddress(),
			packageId: TESTNET_PACKAGE_ID,
			ttlMin: 1,
			signer: kp2,
			haneulClient,
		});
		const certificate = await sessionWithAliasSigner.getCertificate();
		expect(certificate.user).toBe(kp.getPublicKey().toHaneulAddress());
		const certificateSigner = await verifyPersonalMessageSignature(
			sessionWithAliasSigner.getPersonalMessage(),
			certificate.signature,
		);
		expect(certificateSigner.toHaneulAddress()).toBe(kp2.getPublicKey().toHaneulAddress());
	});
});
