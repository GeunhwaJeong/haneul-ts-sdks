// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { getFullnodeUrl, HaneulClient } from '@haneullabs/sui/client';
import { Transaction } from '@haneullabs/sui/transactions';

import { HaneulnsClient } from '../sr./haneulns-client.js';
import { HaneulnsTransaction } from '../sr./haneulns-transaction.js';

// Initialize and execute the HaneulnsClient to fetch the renewal price list
(async () => {
	const network = 'testnet';
	// Step 1: Create a HaneulClient instance
	const haneulClient = new HaneulClient({
		url: getFullnodeUrl(network), // Sui testnet endpoint
	});

	// Step 2: Create a HaneulnsClient instance using TESTNET_CONFIG
	const haneulnsClient = new HaneulnsClient({
		client: haneulClient,
		network,
	});

	/* Following can be used to fetch the coin type discount, registration price, and renewal price */
	console.log(await haneulnsClient.getPriceList());
	console.log(await haneulnsClient.getRenewalPriceList());
	console.log(await haneulnsClient.getCoinTypeDiscount());

	/* Following can be used to fetch the domain record */
	console.log('Domain Record: ', await haneulnsClient.getNameRecord('myname.sui'));

	/* If discount NFT is used */
	// const discountNft = '0xMyDiscountNft'; // This can be a string or a kioskTransactionArgument
	// const discountNftType = await haneulnsClient.getObjectType(discountNft);

	/* Registration Example Using SUI */
	const tx = new Transaction();
	const suinsTx = new HaneulnsTransaction(haneulnsClient, tx);
	const maxPaymentAmount = 5 * 1_000_000; // In GEUNHWA of the payment coin type
	const [coin] = suinsTx.transaction.splitCoins('0xMyCoin', [maxPaymentAmount]);

	/* Registration Example Using NS */
	const coinConfig = haneulnsClient.config.coins.NS; // Specify the coin type used for the transaction
	const priceInfoObjectId = (await haneulnsClient.getPriceInfoObject(tx, coinConfig.feed))[0];
	const nft = suinsTx.register({
		domain: 'myname.sui',
		years: 2,
		coinConfig,
		couponCode: 'fiveplus15percentoff',
		priceInfoObjectId,
		coin,
	});

	/* Registration Example Using USDC */
	// const coinConfig = haneulnsClient.config.coins.USDC; // Specify the coin type used for the transaction
	// const nft = suinsTx.register({
	// 	domain: 'myname.sui',
	// 	years: 2,
	// 	coinConfig,
	// 	coin,
	// });

	// /* Renew Example */
	// const coinConfig = haneulnsClient.config.coins.SUI; // Specify the coin type used for the transaction
	// const priceInfoObjectId = await haneulnsClient.getPriceInfoObject(tx, coinConfig.feed)[0];
	// suinsTx.renew({
	// 	nft: '0xMyNft',
	// 	years: 2,
	// 	coinConfig,
	// 	coin,
	// 	priceInfoObjectId,
	// });

	/* Optionally set target address */
	suinsTx.setTargetAddress({ nft, address: '0xMyAddress' });

	/* Optionally set default */
	suinsTx.setDefault('myname.sui');

	/* Optionally set user data */
	suinsTx.setUserData({
		nft,
		value: 'hello',
		key: 'walrus_site_id',
	});

	/* Optionally transfer the NFT */
	suinsTx.transaction.transferObjects([nft], '0xMyAddress');

	/* Optionally transfer coin */
	suinsTx.transaction.transferObjects([coin], '0xMyAddress');

	/* Subname Example */
	// const subnameNft = suinsTx.createSubName({
	// 	parentNft: '0xMyParentNft',
	// 	name: 'name.myname.sui',
	// 	expirationTimestampMs: 1862491339394,
	// 	allowChildCreation: true,
	// 	allowTimeExtension: true,
	// });
	// suinsTx.transaction.transferObjects([subnameNft], 'YOUR_ADDRESS');

	/* Extend Subname Expiration */
	// suinsTx.extendExpiration({
	// 	nft: '0xMySubnameNft',
	// 	expirationTimestampMs: 1862511339394,
	// });
})();
