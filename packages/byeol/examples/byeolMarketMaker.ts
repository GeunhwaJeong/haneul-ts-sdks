// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import type { ClientWithExtensions } from '@haneullabs/haneul/client';
import { HaneulGrpcClient } from '@haneullabs/haneul/grpc';
import { decodeHaneulPrivateKey } from '@haneullabs/haneul/cryptography';
import type { Keypair } from '@haneullabs/haneul/cryptography';
import { Ed25519Keypair } from '@haneullabs/haneul/keypairs/ed25519';
import type { Transaction } from '@haneullabs/haneul/transactions';

import { byeol, type ByeolClient } from '../src/index.js'; // Adjust path according to new structure
import type { BalanceManager } from '../src/types/index.js';

const GRPC_URLS = {
	mainnet: 'http://158.69.54.239:9000',
	testnet: 'https://fullnode.testnet.haneul.io:443',
} as const;

export class ByeolMarketMaker {
	keypair: Keypair;
	client: ClientWithExtensions<{ byeol: ByeolClient }>;

	constructor(
		keypair: string | Keypair,
		network: 'testnet' | 'mainnet',
		balanceManagers?: { [key: string]: BalanceManager },
		adminCap?: string,
	) {
		let resolvedKeypair: Keypair;

		if (typeof keypair === 'string') {
			resolvedKeypair = ByeolMarketMaker.#getSignerFromPK(keypair);
		} else {
			resolvedKeypair = keypair;
		}

		const address = resolvedKeypair.toHaneulAddress();

		this.keypair = resolvedKeypair;
		this.client = new HaneulGrpcClient({ network, baseUrl: GRPC_URLS[network] }).$extend(
			byeol({
				address: address,
				balanceManagers: balanceManagers,
				adminCap: adminCap,
			}),
		);
	}

	static #getSignerFromPK = (privateKey: string) => {
		const { scheme, secretKey } = decodeHaneulPrivateKey(privateKey);
		if (scheme === 'ED25519') return Ed25519Keypair.fromSecretKey(secretKey);

		throw new Error(`Unsupported scheme: ${scheme}`);
	};

	signAndExecute = async (tx: Transaction) => {
		return this.keypair.signAndExecuteTransaction({
			transaction: tx,
			client: this.client,
		});
	};

	getActiveAddress() {
		return this.keypair.getPublicKey().toHaneulAddress();
	}

	// Example of a flash loan transaction
	// Borrow 1 BYL from BYL_HANEUL pool
	// Swap 0.5 DBUSDC for HANEUL in HANEUL_DBUSDC pool, pay with byl borrowed
	// Swap HANEUL back to BYL
	// Return 1 BYL to BYL_HANEUL pool
	flashLoanExample = async (tx: Transaction) => {
		const borrowAmount = 1;
		const [deepCoin, flashLoan] = tx.add(
			this.client.byeol.flashLoans.borrowBaseAsset('BYL_HANEUL', borrowAmount),
		);

		// Execute trade using borrowed BYL
		const [baseOut, quoteOut, deepOut] = tx.add(
			this.client.byeol.byeol.swapExactQuoteForBase({
				poolKey: 'HANEUL_DBUSDC',
				amount: 0.5,
				deepAmount: 1,
				minOut: 0,
				deepCoin: deepCoin,
			}),
		);

		tx.transferObjects([baseOut, quoteOut, deepOut], this.getActiveAddress());

		// Execute second trade to get back BYL for repayment
		const [baseOut2, quoteOut2, deepOut2] = tx.add(
			this.client.byeol.byeol.swapExactQuoteForBase({
				poolKey: 'BYL_HANEUL',
				amount: 10,
				deepAmount: 0,
				minOut: 0,
			}),
		);

		tx.transferObjects([quoteOut2, deepOut2], this.getActiveAddress());

		// Return borrowed BYL
		const loanRemain = tx.add(
			this.client.byeol.flashLoans.returnBaseAsset(
				'BYL_HANEUL',
				borrowAmount,
				baseOut2,
				flashLoan,
			),
		);
		tx.transferObjects([loanRemain], this.getActiveAddress());
	};

	placeLimitOrderExample = (tx: Transaction) => {
		tx.add(
			this.client.byeol.byeol.placeLimitOrder({
				poolKey: 'HANEUL_DBUSDC',
				balanceManagerKey: 'MANAGER_1',
				clientOrderId: '123456789',
				price: 1,
				quantity: 10,
				isBid: true,
				// orderType default: no restriction
				// selfMatchingOption default: allow self matching
				// payWithDeep default: true
			}),
		);
	};
}
