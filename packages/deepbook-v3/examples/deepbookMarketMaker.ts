// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import type { ClientWithExtensions } from '@haneullabs/haneul/client';
import { HaneulGrpcClient } from '@haneullabs/haneul/grpc';
import { decodeSuiPrivateKey } from '@haneullabs/haneul/cryptography';
import type { Keypair } from '@haneullabs/haneul/cryptography';
import { Ed25519Keypair } from '@haneullabs/haneul/keypairs/ed25519';
import type { Transaction } from '@haneullabs/haneul/transactions';

import { deepbook, type DeepBookClient } from '../src/index.js'; // Adjust path according to new structure
import type { BalanceManager } from '../src/types/index.js';

const GRPC_URLS = {
	mainnet: 'https://fullnode.mainnet.haneul.io:443',
	testnet: 'https://fullnode.testnet.haneul.io:443',
} as const;

export class DeepBookMarketMaker {
	keypair: Keypair;
	client: ClientWithExtensions<{ deepbook: DeepBookClient }>;

	constructor(
		keypair: string | Keypair,
		network: 'testnet' | 'mainnet',
		balanceManagers?: { [key: string]: BalanceManager },
		adminCap?: string,
	) {
		let resolvedKeypair: Keypair;

		if (typeof keypair === 'string') {
			resolvedKeypair = DeepBookMarketMaker.#getSignerFromPK(keypair);
		} else {
			resolvedKeypair = keypair;
		}

		const address = resolvedKeypair.toSuiAddress();

		this.keypair = resolvedKeypair;
		this.client = new HaneulGrpcClient({ network, baseUrl: GRPC_URLS[network] }).$extend(
			deepbook({
				address: address,
				balanceManagers: balanceManagers,
				adminCap: adminCap,
			}),
		);
	}

	static #getSignerFromPK = (privateKey: string) => {
		const { scheme, secretKey } = decodeSuiPrivateKey(privateKey);
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
		return this.keypair.getPublicKey().toSuiAddress();
	}

	// Example of a flash loan transaction
	// Borrow 1 DEEP from DEEP_SUI pool
	// Swap 0.5 DBUSDC for HANEUL in SUI_DBUSDC pool, pay with deep borrowed
	// Swap HANEUL back to DEEP
	// Return 1 DEEP to DEEP_SUI pool
	flashLoanExample = async (tx: Transaction) => {
		const borrowAmount = 1;
		const [deepCoin, flashLoan] = tx.add(
			this.client.deepbook.flashLoans.borrowBaseAsset('DEEP_SUI', borrowAmount),
		);

		// Execute trade using borrowed DEEP
		const [baseOut, quoteOut, deepOut] = tx.add(
			this.client.deepbook.deepBook.swapExactQuoteForBase({
				poolKey: 'SUI_DBUSDC',
				amount: 0.5,
				deepAmount: 1,
				minOut: 0,
				deepCoin: deepCoin,
			}),
		);

		tx.transferObjects([baseOut, quoteOut, deepOut], this.getActiveAddress());

		// Execute second trade to get back DEEP for repayment
		const [baseOut2, quoteOut2, deepOut2] = tx.add(
			this.client.deepbook.deepBook.swapExactQuoteForBase({
				poolKey: 'DEEP_SUI',
				amount: 10,
				deepAmount: 0,
				minOut: 0,
			}),
		);

		tx.transferObjects([quoteOut2, deepOut2], this.getActiveAddress());

		// Return borrowed DEEP
		const loanRemain = tx.add(
			this.client.deepbook.flashLoans.returnBaseAsset(
				'DEEP_SUI',
				borrowAmount,
				baseOut2,
				flashLoan,
			),
		);
		tx.transferObjects([loanRemain], this.getActiveAddress());
	};

	placeLimitOrderExample = (tx: Transaction) => {
		tx.add(
			this.client.deepbook.deepBook.placeLimitOrder({
				poolKey: 'SUI_DBUSDC',
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
