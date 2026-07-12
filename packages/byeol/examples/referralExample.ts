// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { execSync } from 'child_process';
import { HaneulGrpcClient } from '@haneullabs/haneul/grpc';
import { Transaction } from '@haneullabs/haneul/transactions';

import { byeol } from '../src/index.js';

const HANEUL = process.env.HANEUL_BINARY ?? `haneul`;

type Network = 'mainnet' | 'testnet';

export const getActiveAddress = () => {
	return execSync(`${HANEUL} client active-address`, { encoding: 'utf8' }).trim();
};

const getActiveNetwork = (): Network => {
	const env = execSync(`${HANEUL} client active-env`, { encoding: 'utf8' }).trim();
	if (env !== 'mainnet' && env !== 'testnet') {
		throw new Error(`Unsupported network: ${env}. Only 'mainnet' and 'testnet' are supported.`);
	}
	return env;
};

const GRPC_URLS = {
	mainnet: 'http://158.69.54.239:9000',
	testnet: 'https://fullnode.testnet.haneul.io:443',
} as const;

(async () => {
	const network = getActiveNetwork();
	const adminCap = '0x29a62a5385c549dd8e9565312265d2bda0b8700c1560b3e34941671325daae77';
	const marginAdminCap = '0x42a2e769541d272e624c54fff72b878fb0be670776c2b34ef07be5308480650e';
	const marginMaintainerCap = '0xc4bc2b7a2b1f317b8a664294c5cc8501520289c3a6e9b9cc04eef668415b59bf';

	// Initialize with balance managers if needed
	const balanceManagers = {
		BALANCE_MANAGER_1: {
			address: '0x81fd9e1eb2a86643fc84c1e90b908f8a1d30896613c1afede985c041d1e34224',
			tradeCap: '0x46d0afbc50a3af2ee36359ed0624dddf9b7d08807ce96c2d8e65a4c38e3a7e5f',
		},
	};
	const marginManagers = {
		MARGIN_MANAGER_1: {
			address: '0x70a5f28a2400fca515adce1262da0b45ba8f3d1e48f1f2a9568aa29642b5c104',
			poolKey: 'HANEUL_DBUSDC',
		},
	};

	const haneulDbusdcByeolReferral =
		'0x35db71e6431935bde42803fdad7f69d4688bc92abb5e1522bbb8aa3db33c5169';
	const deepHaneulByeolReferral =
		'0x1f6fbf3ecaa948df7b448c932f9f72a604477be63de199d37cee8a9a863c31eb';

	const client = new HaneulGrpcClient({ network, baseUrl: GRPC_URLS[network] }).$extend(
		byeol({
			address: getActiveAddress(),
			adminCap,
			marginAdminCap,
			balanceManagers,
			marginManagers,
			marginMaintainerCap,
		}),
	);

	const tx = new Transaction();

	// --- Byeol Pool Referral Functions ---

	// // 1. Mint a new referral for a pool (multiplier determines fee share)
	client.byeol.byeol.mintReferral('HANEUL_DBUSDC', 1)(tx);
	client.byeol.byeol.mintReferral('BYL_HANEUL', 0.5)(tx);

	// // 2. Update the multiplier for an existing referral
	client.byeol.byeol.updatePoolReferralMultiplier(
		'HANEUL_DBUSDC',
		haneulDbusdcByeolReferral,
		0.75,
	)(tx);

	// // 3. Claim referral rewards (returns base, quote, and byl coins)
	const { baseRewards, quoteRewards, deepRewards } =
		client.byeol.byeol.claimPoolReferralRewards('HANEUL_DBUSDC', haneulDbusdcByeolReferral)(tx);
	tx.transferObjects([baseRewards, quoteRewards, deepRewards], getActiveAddress());

	// --- Balance Manager Referral Functions ---

	// // 4. Set a referral for a balance manager (requires tradeCap)
	client.byeol.balanceManager.setBalanceManagerReferral(
		'BALANCE_MANAGER_1',
		haneulDbusdcByeolReferral,
		tx.object(balanceManagers.BALANCE_MANAGER_1.tradeCap),
	)(tx);

	// // 5. Unset a referral for a balance manager (requires poolKey and tradeCap)
	client.byeol.balanceManager.unsetBalanceManagerReferral(
		'BALANCE_MANAGER_1',
		'HANEUL_DBUSDC',
		tx.object(balanceManagers.BALANCE_MANAGER_1.tradeCap),
	)(tx);

	// --- Margin Manager Referral Functions ---

	// // 6. Set a referral for a margin manager (ByeolPoolReferral)
	client.byeol.marginManager.setMarginManagerReferral(
		'MARGIN_MANAGER_1',
		haneulDbusdcByeolReferral,
	)(tx);

	// // 7. Unset a referral for a margin manager
	client.byeol.marginManager.unsetMarginManagerReferral('MARGIN_MANAGER_1', 'HANEUL_DBUSDC')(tx);

	// // 8. Mint a supply referral for a margin pool
	client.byeol.marginPool.mintSupplyReferral('HANEUL')(tx);

	// // 9. Withdraw referral fees from a margin pool (requires SupplyReferral object)
	const haneulSupplyReferral = '0xaed597fe1a05b9838b198a3dfa2cdd191b6fa7b319f4c3fc676c7b7348cec194';
	const referralFees = client.byeol.marginPool.withdrawReferralFees(
		'HANEUL',
		haneulSupplyReferral,
	)(tx);
	tx.transferObjects([referralFees], getActiveAddress());

	// ==========================================
	// Read-only Functions
	// ==========================================

	// --- Byeol Pool Referral Read-only Functions ---

	// 1. Get referral balances for each pool
	console.log('\n--- Byeol Pool Referral: getPoolReferralBalances ---');
	const haneulDbusdcReferralBalances = await client.byeol.getPoolReferralBalances(
		'HANEUL_DBUSDC',
		haneulDbusdcByeolReferral,
	);
	console.log('HANEUL_DBUSDC Referral Balances:', haneulDbusdcReferralBalances);

	const deepHaneulReferralBalances = await client.byeol.getPoolReferralBalances(
		'BYL_HANEUL',
		deepHaneulByeolReferral,
	);
	console.log('BYL_HANEUL Referral Balances:', deepHaneulReferralBalances);

	// 2. Get multiplier for referrals
	console.log('\n--- Byeol Pool Referral: poolReferralMultiplier ---');
	console.log(
		'HANEUL_DBUSDC Multiplier:',
		await client.byeol.poolReferralMultiplier('HANEUL_DBUSDC', haneulDbusdcByeolReferral),
	);
	console.log(
		'BYL_HANEUL Multiplier:',
		await client.byeol.poolReferralMultiplier('BYL_HANEUL', deepHaneulByeolReferral),
	);

	// --- Balance Manager Referral Read-only Functions ---

	// 3. Get owner of the referrals
	console.log('\n--- Balance Manager Referral: balanceManagerReferralOwner ---');
	const haneulDbusdcReferralOwner =
		await client.byeol.balanceManagerReferralOwner(haneulDbusdcByeolReferral);
	console.log('HANEUL_DBUSDC Referral Owner:', haneulDbusdcReferralOwner);

	const deepHaneulReferralOwner =
		await client.byeol.balanceManagerReferralOwner(deepHaneulByeolReferral);
	console.log('BYL_HANEUL Referral Owner:', deepHaneulReferralOwner);

	// 4. Get pool ID from referral
	console.log('\n--- Balance Manager Referral: balanceManagerReferralPoolId ---');
	console.log(
		'HANEUL_DBUSDC Pool ID:',
		await client.byeol.balanceManagerReferralPoolId(haneulDbusdcByeolReferral),
	);
	console.log(
		'BYL_HANEUL Pool ID:',
		await client.byeol.balanceManagerReferralPoolId(deepHaneulByeolReferral),
	);

	// 5. Get the referral ID set on the balance manager
	console.log('\n--- Balance Manager Referral: getBalanceManagerReferralId ---');
	const haneulDbusdcReferralId = await client.byeol.getBalanceManagerReferralId(
		'BALANCE_MANAGER_1',
		'HANEUL_DBUSDC',
	);
	console.log('HANEUL_DBUSDC Referral ID on BALANCE_MANAGER_1:', haneulDbusdcReferralId);

	const deepHaneulReferralId = await client.byeol.getBalanceManagerReferralId(
		'BALANCE_MANAGER_1',
		'BYL_HANEUL',
	);
	console.log('BYL_HANEUL Referral ID on BALANCE_MANAGER_1:', deepHaneulReferralId);
})();
