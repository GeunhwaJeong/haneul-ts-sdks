// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { Coin, Pool, MarginPool, PythConfig } from '../types/index.js';

export type CoinMap = Record<string, Coin>;
export type PoolMap = Record<string, Pool>;
export type MarginPoolMap = Record<string, MarginPool>;
export interface ByeolPackageIds {
	BYEOL_PACKAGE_ID?: string;
	REGISTRY_ID?: string;
	BYL_TREASURY_ID?: string;
	MARGIN_PACKAGE_ID?: string;
	MARGIN_V1?: string;
	MARGIN_REGISTRY_ID?: string;
	LIQUIDATION_PACKAGE_ID?: string;
}

export const testnetPackageIds = {
	BYEOL_PACKAGE_ID: '0x0000000000000000000000000000000000000000000000000000000000000000',
	REGISTRY_ID: '0x0000000000000000000000000000000000000000000000000000000000000000',
	BYL_TREASURY_ID: '0x0000000000000000000000000000000000000000000000000000000000000000',
	// byeol_margin v16 — the first testnet package carrying the upgraded-Pyth modules.
	MARGIN_PACKAGE_ID: '0x0000000000000000000000000000000000000000000000000000000000000000',
	MARGIN_V1: '0x0000000000000000000000000000000000000000000000000000000000000000',
	MARGIN_REGISTRY_ID: '0x0000000000000000000000000000000000000000000000000000000000000000',
	// margin_liquidation v4 — carries liquidate_base_upgraded / liquidate_quote_upgraded.
	LIQUIDATION_PACKAGE_ID: '0x0000000000000000000000000000000000000000000000000000000000000000',
} satisfies ByeolPackageIds;

export const mainnetPackageIds = {
	BYEOL_PACKAGE_ID: '0xfa6cb7b6b0116d552e70cc83f293456502ebf7c37485762570077fde11a7cda8',
	REGISTRY_ID: '0xed6388354d0d6708573104f98885fadd95727d8c24c4f0d110bdf2412777b2eb',
	BYL_TREASURY_ID: '0x1033499ad60f51cc3c552f04088980cea99f44f043747a3e30eabc342fd5446c',
	// byeol_margin v7 — the first mainnet package carrying the upgraded-Pyth modules.
	// Its gate constant is `MARGIN_VERSION = 7`, and every entrypoint asserts the registry
	// allows that version, so this id only works once `enable_version(7)` has run on the
	// mainnet MarginRegistry. Until then v7 flows abort `EPackageVersionDisabled`.
	MARGIN_PACKAGE_ID: '0x0000000000000000000000000000000000000000000000000000000000000000',
	MARGIN_V1: '0x0000000000000000000000000000000000000000000000000000000000000000',
	MARGIN_REGISTRY_ID: '0x0000000000000000000000000000000000000000000000000000000000000000',
	LIQUIDATION_PACKAGE_ID: '0x0000000000000000000000000000000000000000000000000000000000000000',
} satisfies ByeolPackageIds;

/**
 * Feed ids and price objects on Pyth's upgraded Core, the only deployment this SDK targets.
 *
 * The testnet `MarginRegistry` was migrated (2026-08-11) off Pyth's beta feed ids and onto
 * the ids upgraded testnet Core carries, which are the mainnet-style ids — the beta ids
 * have no upgraded price objects and the upgraded Hermes does not serve them.
 *
 * DBTC is testnet's wrapped BTC and takes Crypto.XBTC/USD — the same feed mainnet XBTC
 * uses. The upgraded deployment carries no distinct DBTC feed. Plain Crypto.BTC/USD is
 * NOT an accepted substitute for either: XBTC is a distinct asset with its own peg and
 * redemption risk, so pricing it off BTC would misstate collateral in exactly the stress
 * where the two diverge.
 */
export const testnetCoins: CoinMap = {
	BYL: {
		address: `0x36dbef866a1d62bf7328989a10fb2f07d769f4ee587c0de4a0a256e57e0a58a8`,
		type: `0x36dbef866a1d62bf7328989a10fb2f07d769f4ee587c0de4a0a256e57e0a58a8::byl::BYL`,
		scalar: 1000000,
		feed: '0x29bdd5248234e33bd93d3b81100b5fa32eaa5997843847e2c2cb16d7c6d9f7ff',
		currencyId: '0xbf1b77e244f649c736a44898585cc8ac939fbb0bbdf1d8d2a183978cc312e613',
		priceInfoObjectId: '0x27882b43c2cc62bbd8fb5f4ebc20be004b14454b2c98755033f5446d35474339',
	},
	HANEUL: {
		address: `0x0000000000000000000000000000000000000000000000000000000000000002`,
		type: `0x0000000000000000000000000000000000000000000000000000000000000002::haneul::HANEUL`,
		scalar: 1000000000,
		feed: '0x0000000000000000000000000000000000000000000000000000000000000000',
		currencyId: '0xf256d3fb6a50eaa748d94335b34f2982fbc3b63ceec78cafaa29ebc9ebaf2bbc',
		priceInfoObjectId: '0x867877562b5d8ac262d93b02062e04b428a2f9bfbb2f05b8af52e04cd98bd241',
	},
	DBUSDC: {
		address: `0xf7152c05930480cd740d7311b5b8b45c6f488e3a53a11c3f74a6fac36a52e0d7`,
		type: `0xf7152c05930480cd740d7311b5b8b45c6f488e3a53a11c3f74a6fac36a52e0d7::DBUSDC::DBUSDC`,
		scalar: 1000000,
		feed: '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a',
		currencyId: '0x509db0f9283c9ee4fdc5b99028a439d3639f49e9709e3d7a6de14b3bfdb0c784',
		priceInfoObjectId: '0x17de8d80e8efedfd1053c46fb921e51824479ed32c6aded5f7279995bb84db05',
	},
	DBTC: {
		address: `0x6502dae813dbe5e42643c119a6450a518481f03063febc7e20238e43b6ea9e86`,
		type: `0x6502dae813dbe5e42643c119a6450a518481f03063febc7e20238e43b6ea9e86::dbtc::DBTC`,
		scalar: 100000000,
		// Crypto.XBTC/USD — DBTC is testnet's wrapped BTC, so it takes the same feed mainnet
		// XBTC does. Never plain BTC/USD: that is a different asset, and standing it in
		// would misprice DBTC collateral whenever XBTC's peg moves. Object created on
		// upgraded testnet Core 2026-08-11.
		feed: '0xae8f269ed9c4bed616c99a98cf6dfe562bd3202e7f91821a471ff854713851b4',
		currencyId: '0x3ef2afa2126704bf721b9c8495d94288f6bd090fc454fe3e1613eb765a8a348f',
		priceInfoObjectId: '0x88387b85b9a53c4365219aee4d77e62213877f110eb859d8e03812a5bea0d1f7',
	},
	DBUSDT: {
		address: `0xf7152c05930480cd740d7311b5b8b45c6f488e3a53a11c3f74a6fac36a52e0d7`,
		type: `0xf7152c05930480cd740d7311b5b8b45c6f488e3a53a11c3f74a6fac36a52e0d7::DBUSDT::DBUSDT`,
		scalar: 1000000,
	},
	WAL: {
		address: `0x9ef7676a9f81937a52ae4b2af8d511a28a0b080477c0c2db40b0ab8882240d76`,
		type: `0x9ef7676a9f81937a52ae4b2af8d511a28a0b080477c0c2db40b0ab8882240d76::wal::WAL`,
		scalar: 1000000000,
	},
};

export const mainnetCoins: CoinMap = {
	BYL: {
		address: `0xedcf12e21f1c6fbfd8fa8fa831a53868cefad279f1d164825e0a5acf09e5ee78`,
		type: `0xedcf12e21f1c6fbfd8fa8fa831a53868cefad279f1d164825e0a5acf09e5ee78::byl::BYL`,
		scalar: 1000000,
		feed: '',
		currencyId: '',
		priceInfoObjectId: '',
	},
	HANEUL: {
		address: `0x0000000000000000000000000000000000000000000000000000000000000002`,
		type: `0x0000000000000000000000000000000000000000000000000000000000000002::haneul::HANEUL`,
		scalar: 1000000000,
		feed: '',
		currencyId: '',
		priceInfoObjectId: '',
	},
	USDC: {
		address: `0x6b7638d3d91245229f51f48d5c39bcb6ff7023ff022954a0bd94441d8ee20b4a`,
		type: `0x6b7638d3d91245229f51f48d5c39bcb6ff7023ff022954a0bd94441d8ee20b4a::usdc::USDC`,
		scalar: 1000000,
		feed: '',
		currencyId: '',
		priceInfoObjectId: '',
	},
};

export const testnetPools: PoolMap = {
	BYL_HANEUL: {
		address: `0x48c95963e9eac37a316b7ae04a0deb761bcdcc2b67912374d6036e7f0e9bae9f`,
		baseCoin: 'BYL',
		quoteCoin: 'HANEUL',
	},
	HANEUL_DBUSDC: {
		address: `0x1c19362ca52b8ffd7a33cee805a67d40f31e6ba303753fd3a4cfdfacea7163a5`,
		baseCoin: 'HANEUL',
		quoteCoin: 'DBUSDC',
	},
	BYL_DBUSDC: {
		address: `0xe86b991f8632217505fd859445f9803967ac84a9d4a1219065bf191fcb74b622`,
		baseCoin: 'BYL',
		quoteCoin: 'DBUSDC',
	},
	DBUSDT_DBUSDC: {
		address: `0x83970bb02e3636efdff8c141ab06af5e3c9a22e2f74d7f02a9c3430d0d10c1ca`,
		baseCoin: 'DBUSDT',
		quoteCoin: 'DBUSDC',
	},
	WAL_DBUSDC: {
		address: `0xeb524b6aea0ec4b494878582e0b78924208339d360b62aec4a8ecd4031520dbb`,
		baseCoin: 'WAL',
		quoteCoin: 'DBUSDC',
	},
	WAL_HANEUL: {
		address: `0x8c1c1b186c4fddab1ebd53e0895a36c1d1b3b9a77cd34e607bef49a38af0150a`,
		baseCoin: 'WAL',
		quoteCoin: 'HANEUL',
	},
	DBTC_DBUSDC: {
		address: `0x0dce0aa771074eb83d1f4a29d48be8248d4d2190976a5241f66b43ec18fa34de`,
		baseCoin: 'DBTC',
		quoteCoin: 'DBUSDC',
	},
};

export const mainnetPools: PoolMap = {
	HANEUL_USDC: {
		address: `0xba20cefb68684d17a38945c8f96b87a08ed79c95ac6894cced657331f4381370`,
		baseCoin: 'HANEUL',
		quoteCoin: 'USDC',
	},
};

export const testnetMarginPools = {
	HANEUL: {
		address: '0xcdbbe6a72e639b647296788e2e4b1cac5cea4246028ba388ba1332ff9a382eea',
		type: '0x0000000000000000000000000000000000000000000000000000000000000002::haneul::HANEUL',
	},
	DBUSDC: {
		address: '0xf08568da93834e1ee04f09902ac7b1e78d3fdf113ab4d2106c7265e95318b14d',
		type: '0xf7152c05930480cd740d7311b5b8b45c6f488e3a53a11c3f74a6fac36a52e0d7::DBUSDC::DBUSDC',
	},
	BYL: {
		address: '0x610640613f21d9e688d6f8103d17df22315c32e0c80590ce64951a1991378b55',
		type: '0x36dbef866a1d62bf7328989a10fb2f07d769f4ee587c0de4a0a256e57e0a58a8::byl::BYL',
	},
	DBTC: {
		address: '0xf3440b4aafcc8b12fc4b242e9590c52873b8238a0d0e52fbf9dae61d2970796a',
		type: '0x6502dae813dbe5e42643c119a6450a518481f03063febc7e20238e43b6ea9e86::dbtc::DBTC',
	},
};

export const mainnetMarginPools = {

};

export const testnetPythConfigs = {
	pythStateId: '0x3c48fe392912de6c18087a2b3f5fdbfbfdb4598e180947feff1f12f8e9ea073e',
	wormholeStateId: '0x750da8e6d16b6a363a39fe2eaa8295ac224a1e6fce4e47b58845e2e8746164f0',
} satisfies PythConfig;

export const mainnetPythConfigs = {
	pythStateId: '0x0000000000000000000000000000000000000000000000000000000000000000',
	wormholeStateId: '0x0000000000000000000000000000000000000000000000000000000000000000',
} satisfies PythConfig;

/**
 * Hermes serving Pyth's upgraded Core. Requires an `Authorization: Bearer <token>` header
 * and answers 401 without one. Note that from the Core cutover this also becomes true of
 * legacy Hermes, so an unauthenticated price push has no long-term path.
 */
export const PYTH_UPGRADED_HERMES = 'https://pyth.dourolabs.app/hermes';

/**
 * Byeol-operated Hermes proxy: forwards to {@link PYTH_UPGRADED_HERMES} supplying
 * credentials server-side, so consumers without their own Pyth plan can still push price
 * updates. Used only when no `accessToken` is configured — bring your own token and the
 * SDK talks to Pyth directly, with no Byeol infrastructure in the path.
 *
 * `undefined` until the proxy is deployed. It must stay `undefined` rather than a
 * placeholder URL: it is the default endpoint whenever a consumer supplies no credentials,
 * so a non-resolving value here surfaces as an opaque `Invalid URL`/DNS error from inside
 * axios instead of a configuration error naming the field to set.
 */
export const BYEOL_HERMES_PROXY: string | undefined = undefined;
