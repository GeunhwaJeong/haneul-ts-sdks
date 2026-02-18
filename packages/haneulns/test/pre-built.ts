// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { getJsonRpcFullnodeUrl } from '@haneullabs/haneul/jsonRpc';
import { HaneulGrpcClient } from '@haneullabs/haneul/grpc';
import { Transaction } from '@haneullabs/haneul/transactions';
import { GEUNHWA_PER_HANEUL, normalizeHaneulAddress } from '@haneullabs/haneul/utils';
import { expect } from 'vitest';

import { ALLOWED_METADATA, SuinsTransaction, haneulns } from '../src/index.js';

export const e2eLiveNetworkDryRunFlow = async (network: 'mainnet' | 'testnet') => {
	const client = new HaneulGrpcClient({ baseUrl: getJsonRpcFullnodeUrl(network), network }).$extend(
		haneulns(),
	);

	const sender = normalizeHaneulAddress('0x2');

	// Getting price lists accurately
	const priceList = await client.haneulns.getPriceList();
	const renewalPriceList = await client.haneulns.getRenewalPriceList();
	const coinDiscount = await client.haneulns.getCoinTypeDiscount();

	// Expected lists - mainnet and testnet have different prices
	const expectedPriceList =
		network === 'mainnet'
			? new Map([
					[[3, 3], 500000000],
					[[4, 4], 100000000],
					[[5, 63], 10000000],
				])
			: new Map([
					[[3, 3], 50000000],
					[[4, 4], 10000000],
					[[5, 63], 1000000],
				]);

	const expectedRenewalPriceList =
		network === 'mainnet'
			? new Map([
					[[3, 3], 150000000],
					[[4, 4], 50000000],
					[[5, 63], 5000000],
				])
			: new Map([
					[[3, 3], 15000000],
					[[4, 4], 5000000],
					[[5, 63], 500000],
				]);

	const expectedCoinDiscount = new Map([
		[client.haneulns.config.coins.USDC.type.slice(2), 0],
		[client.haneulns.config.coins.HANEUL.type.slice(2), 0],
		[client.haneulns.config.coins.NS.type.slice(2), 25],
	]);
	expect(priceList).toEqual(expectedPriceList);
	expect(renewalPriceList).toEqual(expectedRenewalPriceList);
	expect(coinDiscount).toEqual(expectedCoinDiscount);

	const tx = new Transaction();
	const coinConfig = client.haneulns.config.coins.HANEUL; // Specify the coin type used for the transaction

	// Split coins for registration and Pyth fee upfront
	const [coinInput, pythFeeCoin] = tx.splitCoins(tx.gas, [10n * GEUNHWA_PER_HANEUL, GEUNHWA_PER_HANEUL]);

	const priceInfoObjectId =
		coinConfig !== client.haneulns.config.coins.USDC
			? (await client.haneulns.getPriceInfoObject(tx, coinConfig.feed, pythFeeCoin))[0]
			: null;

	const haneulnsTx = new SuinsTransaction(client.haneulns, tx);

	const uniqueName =
		(Date.now().toString(36) + Math.random().toString(36).substring(2)).repeat(2) + '.haneul';
	// register test.haneul for 2 years.
	const nft = haneulnsTx.register({
		domain: uniqueName,
		years: 2,
		coinConfig: client.haneulns.config.coins.HANEUL,
		coin: coinInput,
		priceInfoObjectId,
	});
	// Sets the target address of the NFT.
	haneulnsTx.setTargetAddress({
		nft,
		address: sender,
		isSubname: false,
	});

	haneulnsTx.setDefault(uniqueName);

	// Sets the avatar of the NFT.
	haneulnsTx.setUserData({
		nft,
		key: ALLOWED_METADATA.avatar,
		value: '0x0',
	});

	haneulnsTx.setUserData({
		nft,
		key: ALLOWED_METADATA.contentHash,
		value: '0x1',
	});

	haneulnsTx.setUserData({
		nft,
		key: ALLOWED_METADATA.walrusSiteId,
		value: '0x2',
	});

	const subNft = haneulnsTx.createSubName({
		parentNft: nft,
		name: 'node.' + uniqueName,
		expirationTimestampMs: Date.now() + 1000 * 60 * 60 * 24 * 30,
		allowChildCreation: true,
		allowTimeExtension: true,
	});

	// create/remove some leaf names as an NFT
	haneulnsTx.createLeafSubName({
		parentNft: nft,
		name: 'leaf.' + uniqueName,
		targetAddress: sender,
	});
	haneulnsTx.removeLeafSubName({ parentNft: nft, name: 'leaf.' + uniqueName });

	// do it for sub nft too
	haneulnsTx.createLeafSubName({
		parentNft: subNft,
		name: 'leaf.node.' + uniqueName,
		targetAddress: sender,
	});
	haneulnsTx.removeLeafSubName({ parentNft: subNft, name: 'leaf.node.' + uniqueName });

	// extend expiration a bit further for the subNft
	haneulnsTx.extendExpiration({
		nft: subNft,
		expirationTimestampMs: Date.now() + 1000 * 60 * 60 * 24 * 30 * 2,
	});

	haneulnsTx.editSetup({
		parentNft: nft,
		name: 'node.' + uniqueName,
		allowChildCreation: true,
		allowTimeExtension: false,
	});

	// let's go 2 levels deep and edit setups!
	const moreNestedNft = haneulnsTx.createSubName({
		parentNft: subNft,
		name: 'more.node.' + uniqueName,
		allowChildCreation: true,
		allowTimeExtension: true,
		expirationTimestampMs: Date.now() + 1000 * 60 * 60 * 24 * 30,
	});

	haneulnsTx.editSetup({
		parentNft: subNft,
		name: 'more.node.' + uniqueName,
		allowChildCreation: false,
		allowTimeExtension: false,
	});

	// do it for sub nft too
	tx.transferObjects([moreNestedNft, subNft, nft, coinInput, pythFeeCoin], tx.pure.address(sender));

	tx.setSender(sender);

	return client.simulateTransaction({
		transaction: tx,
		include: {
			effects: true,
		},
	});
};
