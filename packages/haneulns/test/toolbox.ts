// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { execSync } from 'child_process';
import { mkdtemp } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import { getFullnodeUrl, HaneulClient } from '@haneullabs/haneul/client';
import { FaucetRateLimitError, getFaucetHost, requestHaneulFromFaucetV2 } from '@haneullabs/haneul/faucet';
import { Ed25519Keypair } from '@haneullabs/haneul/keypairs/ed25519';
import { retry } from 'ts-retry-promise';

//@ts-ignore-next-line
export const SUI_BIN = process.env.VITE_SUI_BIN ?? `sui`;

//@ts-ignore-next-line
const DEFAULT_FAUCET_URL = process.env.VITE_FAUCET_URL ?? getFaucetHost('localnet');
//@ts-ignore-next-line
const DEFAULT_FULLNODE_URL = process.env.VITE_FULLNODE_URL ?? getFullnodeUrl('localnet');

export class TestToolbox {
	keypair: Ed25519Keypair;
	client: HaneulClient;
	configPath: string;

	constructor(keypair: Ed25519Keypair, client: HaneulClient, configPath: string) {
		this.keypair = keypair;
		this.client = client;
		this.configPath = configPath;
	}

	address() {
		return this.keypair.getPublicKey().toHaneulAddress();
	}

	public async getActiveValidators() {
		return (await this.client.getLatestHaneulSystemState()).activeValidators;
	}
}

export function getClient(): HaneulClient {
	return new HaneulClient({
		url: DEFAULT_FULLNODE_URL,
	});
}

// TODO: expose these testing utils from @haneullabs/haneul
export async function setupHaneulClient() {
	const keypair = Ed25519Keypair.generate();
	const address = keypair.getPublicKey().toHaneulAddress();
	const client = getClient();
	await retry(() => requestHaneulFromFaucetV2({ host: DEFAULT_FAUCET_URL, recipient: address }), {
		backoff: 'EXPONENTIAL',
		// overall timeout in 60 seconds
		timeout: 1000 * 60,
		// skip retry if we hit the rate-limit error
		retryIf: (error: any) => !(error instanceof FaucetRateLimitError),
		logger: (msg) => console.warn('Retrying requesting from faucet: ' + msg),
	});

	const tmpDirPath = path.join(tmpdir(), 'config-');
	const tmpDir = await mkdtemp(tmpDirPath);
	const configPath = path.join(tmpDir, 'client.yaml');
	execSync(`${SUI_BIN} client --yes --client.config ${configPath}`, { encoding: 'utf-8' });
	return new TestToolbox(keypair, client, configPath);
}
