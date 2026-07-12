// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { Config } from './types.js';

export const MAX_U64 = BigInt('18446744073709551615');

/**
 * Allowed keys for metadata.
 */
export const ALLOWED_METADATA = {
	contentHash: 'content_hash',
	avatar: 'avatar',
	walrusSiteId: 'walrus_site_id',
};

export const mainPackage: Config = {
	mainnet: {
		packageId: '0x047dfbd82298ec1c2c70b5743a8c4a00614ff864a580069c635f2dad3a7c76fa',
		packageIdV1: '0x047dfbd82298ec1c2c70b5743a8c4a00614ff864a580069c635f2dad3a7c76fa',
		packageIdPricing: '0x047dfbd82298ec1c2c70b5743a8c4a00614ff864a580069c635f2dad3a7c76fa',
		haneulns: '0x186ad0dd1d4d4bc84564b3c039a0d432ab4d4af851e07cc84f083cc5e850f6d0',
		discountsPackage: {
			packageId: '0x0000000000000000000000000000000000000000000000000000000000000000',
			discountHouseId: '0x0000000000000000000000000000000000000000000000000000000000000000',
		},
		subNamesPackageId: '0x3ebb0b633d4d56c2eaad2b1849fcc8cddbab832414e91b4159dd4a57c4a720d4',
		tempSubdomainsProxyPackageId:
			'0x0000000000000000000000000000000000000000000000000000000000000000',
		coupons: {
			packageId: '0x0000000000000000000000000000000000000000000000000000000000000000',
		},
		payments: {
			packageId: '0x0000000000000000000000000000000000000000000000000000000000000000',
		},
		bbb: {
			packageId: '0x0000000000000000000000000000000000000000000000000000000000000000',
			vault: '0x0000000000000000000000000000000000000000000000000000000000000000',
		},
		pyth: {
			pythStateId: '0x0000000000000000000000000000000000000000000000000000000000000000',
			wormholeStateId: '0x0000000000000000000000000000000000000000000000000000000000000000',
		},
		coins: {
			HANEUL: {
				type: '0x0000000000000000000000000000000000000000000000000000000000000002::haneul::HANEUL',
				feed: '0x0000000000000000000000000000000000000000000000000000000000000000',
			},
			NS: {
				type: '0x0000000000000000000000000000000000000000000000000000000000000000::ns::NS',
				feed: '0x0000000000000000000000000000000000000000000000000000000000000000',
			},
			USDC: {
				type: '0x6b7638d3d91245229f51f48d5c39bcb6ff7023ff022954a0bd94441d8ee20b4a::usdc::USDC',
				feed: '',
			},
		},
		registryTableId: '0xf539703ae28a9f324729506626766909f800a7e40ec90c6f2c8e865103d96525',
	},
	testnet: {
		packageId: '0x40eee27b014a872f5c3330dcd5329aa55c7fe0fcc6e70c6498852e2e3727172e',
		packageIdV1: '0x22fa05f21b1ad71442491220bb9338f7b7095fe35000ef88d5400d28523bdd93',
		packageIdPricing: '0x8a4df604a449ccb9ef2efb9747046b78f78ba60fc8d88df098d0dd47619df5a4',
		haneulns: '0x300369e8909b9a6464da265b9a5a9ab6fe2158a040e84e808628cde7a07ee5a3',
		discountsPackage: {
			packageId: '0x7976f9bfe81dcbdbb635efb0ecb02844cd79109d3a698d05c06ca9fd2f97d262',
			discountHouseId: '0x9f1ac0f49ddaec4fd2248ae1cc63ed91946f43a236b333439efb9126f31f8e9b',
		},
		subNamesPackageId: '0x3c272bc45f9157b7818ece4f7411bdfa8af46303b071aca4e18c03119c9ff636',
		tempSubdomainsProxyPackageId:
			'0x295a0749dae0e76126757c305f218f929df0656df66a6361f8b6c6480a943f12',
		coupons: {
			packageId: '0x63029aae8abbefae4f4ac6c5e3e0021159ea93a94ba648681fd64caf5b40677a',
		},
		payments: {
			packageId: '0xc391c200188dd1a363ff12dcffe07eaac5cf28ad1cd8dc0fcc18f2f8625f0da2',
		},
		bbb: {
			packageId: '0xed9b18147ca81c8f3f60192c8d0630574e42387cd200a6e39b3e4e07df1ce6e6',
			vault: '0xa0b7a4dcbb85209c9096a4e0e85e43b716377c605743193abe915e9c9f3043e5',
		},
		pyth: {
			pythStateId: '0x243759059f4c3111179da5878c12f68d612c21a8d54d85edc86164bb18be1c7c',
			wormholeStateId: '0x31358d198147da50db32eda2562951d53973a0c0ad5ed738e9b17d88b213d790',
		},
		/// Testnet coins will be different here for testing purposes, we can publish our own
		coins: {
			HANEUL: {
				type: '0x0000000000000000000000000000000000000000000000000000000000000002::haneul::HANEUL',
				feed: '0x50c67b3fd225db8912a424dd4baed60ffdde625ed2feaaf283724f9608fea266',
			},
			/// this is a test token published as 0xb48aac3f53bab328e1eb4c5b3c34f55e760f2fb3f2305ee1a474878d80f650f0::TESTNS::TESTNS
			/// NS token is using the HFT feed since NS feed on testnet is not available
			NS: {
				type: '0xb48aac3f53bab328e1eb4c5b3c34f55e760f2fb3f2305ee1a474878d80f650f0::TESTNS::TESTNS',
				feed: '0x99137a18354efa7fb6840889d059fdb04c46a6ce21be97ab60d9ad93e91ac758',
			},
			/// this is a test token published as 0xb48aac3f53bab328e1eb4c5b3c34f55e760f2fb3f2305ee1a474878d80f650f0::TESTUSDC::TESTUSDC
			USDC: {
				type: '0xb48aac3f53bab328e1eb4c5b3c34f55e760f2fb3f2305ee1a474878d80f650f0::TESTUSDC::TESTUSDC',
				feed: '',
			},
		},
		registryTableId: '0xb120c0d55432630fce61f7854795a3463deb6e3b443cc4ae72e1282073ff56e4',
	},
};
