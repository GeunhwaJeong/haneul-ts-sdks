// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from 'vitest';

import { getFullnodeUrl, HaneulClient } from '../../src/client';
import { namedPackagesPlugin, Transaction } from '../../src/transactions';
import { normalizeHaneulAddress } from '../../src/utils';
import { extractMvrTypes } from '../../src/experimental/mvr';

const MAINNET_URL = 'https://mainnet.mvr.haneullabs.com';
const TESTNET_URL = 'https://testnet.mvr.haneullabs.com';

const mainnetPlugin = namedPackagesPlugin({
	url: MAINNET_URL,
	overrides: {
		packages: {
			'@framework/std': '0x1',
			'@framework/std/1': '0x1',
		},
		types: {
			'@framework/std::string::String': '0x1::string::String',
			'@framework/std::vector::empty': '0x1::vector::empty',
		},
	},
});

const testnetPlugin = namedPackagesPlugin({
	url: TESTNET_URL,
	overrides: {
		packages: {
			'@framework/std': '0x1',
			'@framework/std/1': '0x1',
		},
		types: {
			'@framework/std::string::String': '0x1::string::String',
			'@framework/std::vector::empty': '0x1::vector::empty',
		},
	},
});

// A local plugin that does not do any online resolution,
// but can work for the pre-defined cache.
const localCachePlugin = namedPackagesPlugin({
	url: '', // empty URL, no online resolution.
	overrides: {
		packages: {
			'@framework/std': '0x1',
			'@framework/haneul': '0x2',
		},
		types: {
			'@framework/haneul::vec_set::VecSet': '0x2::vec_set::VecSet',
			'@framework/std::string::String': '0x1::string::String',
			'@framework/haneul::haneul::HANEUL': '0x2::haneul::HANEUL',
		},
	},
});

const localMvrOverrides = {
	packages: {
		'@framework/std': '0x1',
		'@framework/haneul': '0x2',
	},
	types: {
		'@framework/haneul::vec_set::VecSet': '0x2::vec_set::VecSet',
		'@framework/std::string::String': '0x1::string::String',
		'@framework/haneul::haneul::HANEUL': '0x2::haneul::HANEUL',
	},
};

describe.concurrent('Name Resolution Plugin', () => {
	it('Should replace names in a given PTB', async () => {
		const transaction = new Transaction();
		transaction.addSerializationPlugin(mainnetPlugin);

		// replace .move names properly
		transaction.moveCall({
			target: '@framework/std::string::utf8',
			arguments: [transaction.pure.string('Hello, world!')],
		});

		// replace type args properly
		transaction.moveCall({
			target: '@framework/std::vector::empty',
			typeArguments: ['@framework/std::string::String'],
		});

		// replace nested type args properly
		transaction.moveCall({
			target: '@framework/std/1::vector::empty',
			typeArguments: ['@framework/std::vector::empty<@framework/std::string::String>'],
		});

		// replace type args in `MakeMoveVec` call.
		transaction.makeMoveVec({
			type: '@framework/std::string::String',
			elements: [transaction.pure.string('Hello, world!')],
		});

		const json = JSON.parse(
			await transaction.toJSON({ client: new HaneulClient({ url: getFullnodeUrl('testnet') }) }),
		);

		expect(json.commands[0].MoveCall.package).toBe(normalizeHaneulAddress('0x1'));
		expect(json.commands[1].MoveCall.typeArguments[0]).toBe(`0x1::string::String`);
		expect(json.commands[2].MoveCall.package).toBe(normalizeHaneulAddress('0x1'));
		expect(json.commands[2].MoveCall.typeArguments[0]).toBe(
			`0x1::vector::empty<0x1::string::String>`,
		);
	});
});

describe.concurrent('Name Resolution Plugin (MVR) - Mainnet', () => {
	it('Should replace target calls in a given PTB', async () => {
		await simplePtb('mainnet');
	});

	it('Should replace target calls AND types in a given PTB', async () => {
		await nestedTypeArgsPtb('mainnet');
	});
});

describe.concurrent('Name Resolution Plugin (MVR) - Testnet', () => {
	it('Should replace target calls in a given PTB', async () => {
		await simplePtb('testnet');
	});

	it('Should replace target calls AND types in a given PTB', async () => {
		await nestedTypeArgsPtb('testnet');
	});
});

describe.concurrent('Name Resolution Plugin (With client overrides)', () => {
	it('Should replace composite types in a given PTB', async () => {
		const transaction = new Transaction();

		const zeroCoin = transaction.moveCall({
			target: '@framework/haneul::coin::zero',
			typeArguments: ['@framework/haneul::haneul::HANEUL'],
		});

		transaction.transferObjects([zeroCoin], normalizeHaneulAddress('0x2'));

		// Types are composed here, without needing any API calls, even if we do not have the
		// full type in the cache.
		transaction.moveCall({
			target: '@framework/std::vector::empty',
			typeArguments: ['@framework/haneul::vec_set::VecSet<@framework/std::string::String>'],
		});

		const res = await dryRun(transaction, 'testnet', true);
		expect(res.effects.status.status).toEqual('success');
	});

	it('Should replace composite types twice, and not have any weird side effects', async () => {
		const transaction = new Transaction();

		const zeroCoin = transaction.moveCall({
			target: '@framework/haneul::coin::zero',
			typeArguments: ['@framework/haneul::haneul::HANEUL'],
		});

		transaction.transferObjects([zeroCoin], normalizeHaneulAddress('0x2'));

		// Types are composed here, without needing any API calls, even if we do not have the
		// full type in the cache.
		transaction.moveCall({
			target: '@framework/std::vector::empty',
			typeArguments: ['@framework/haneul::vec_set::VecSet<@framework/std::string::String>'],
		});

		const res = await dryRun(transaction, 'testnet', true);
		expect(res.effects.status.status).toEqual('success');
	});
});

describe.concurrent('Name Resolution Plugin (Local Cache)', () => {
	it('Should replace composite types in a given PTB', async () => {
		const transaction = new Transaction();
		transaction.addSerializationPlugin(localCachePlugin);

		const zeroCoin = transaction.moveCall({
			target: '@framework/haneul::coin::zero',
			typeArguments: ['@framework/haneul::haneul::HANEUL'],
		});

		transaction.transferObjects([zeroCoin], normalizeHaneulAddress('0x2'));

		// Types are composed here, without needing any API calls, even if we do not have the
		// full type in the cache.
		transaction.moveCall({
			target: '@framework/std::vector::empty',
			typeArguments: ['@framework/haneul::vec_set::VecSet<@framework/std::string::String>'],
		});

		const res = await dryRun(transaction, 'testnet');
		expect(res.effects.status.status).toEqual('success');
	});

	it('Should replace composite types twice, and not have any weird side effects', async () => {
		const transaction = new Transaction();
		transaction.addSerializationPlugin(localCachePlugin);

		const zeroCoin = transaction.moveCall({
			target: '@framework/haneul::coin::zero',
			typeArguments: ['@framework/haneul::haneul::HANEUL'],
		});

		transaction.transferObjects([zeroCoin], normalizeHaneulAddress('0x2'));

		// Types are composed here, without needing any API calls, even if we do not have the
		// full type in the cache.
		transaction.moveCall({
			target: '@framework/std::vector::empty',
			typeArguments: ['@framework/haneul::vec_set::VecSet<@framework/std::string::String>'],
		});

		const res = await dryRun(transaction, 'testnet');
		expect(res.effects.status.status).toEqual('success');
	});
});

describe.concurrent('Utility functions', () => {
	it('should properly extract first-level structs ', () => {
		const testSets = [
			{
				input: ['@mvr/demo::a::A<u64, @mvr/another-demo::b::B>'],
				output: ['@mvr/demo::a::A', '@mvr/another-demo::b::B'],
			},
			{
				input: ['@mvr/demo::a::A<u64, @mvr/another-demo::b::B<u128>>'],
				output: ['@mvr/demo::a::A', '@mvr/another-demo::b::B'],
			},
			{
				input: ['@mvr/demo::a::A<u64, @mvr/another-demo::b::B<u128>>', '@mvr/demo::c::C'],
				output: ['@mvr/demo::a::A', '@mvr/another-demo::b::B', '@mvr/demo::c::C'],
			},
			{
				input: [
					'@mvr/demo::a::A<@mvr/demo::b::B<@mvr/demo::c::C<u64, bool,@mvr/demo::d::D>,@mvr/demo::e::E>>',
				],
				output: [
					'@mvr/demo::a::A',
					'@mvr/demo::b::B',
					'@mvr/demo::c::C',
					'@mvr/demo::d::D',
					'@mvr/demo::e::E',
				],
			},
			{
				input: ['u64', '0x2::balance::Balance<0x2::haneul::HANEUL>'],
				output: [],
			},
		];

		for (const testSet of testSets) {
			const extracted = new Set<string>();

			for (const type of testSet.input) {
				extractMvrTypes(type, extracted);
			}
			expect(extracted).toEqual(new Set(testSet.output));
		}
	});

	it('Should fail to initialize a plugin with generic type tags', () => {
		const cache = {
			packages: {},
			types: {
				'@mvr/demo::a::A<@mvr/demo::b::B>': '0x1::a::A<0x1::b::B>',
			},
		};

		expect(() =>
			namedPackagesPlugin({
				url: '',
				overrides: cache,
			}),
		).toThrow();
	});
});

const simplePtb = async (network: 'mainnet' | 'testnet') => {
	const transaction = new Transaction();

	transaction.addSerializationPlugin(network === 'mainnet' ? mainnetPlugin : testnetPlugin);

	const v1 = transaction.moveCall({
		target: `@pkg/qwer::mvr_a::new_v1`,
	});

	transaction.moveCall({
		target: `@pkg/qwer::mvr_a::new`,
		arguments: [v1],
	});

	transaction.makeMoveVec({
		type: '@pkg/qwer::mvr_a::V1',
		elements: [
			transaction.moveCall({
				target: `@pkg/qwer::mvr_a::new_v1`,
			}),
		],
	});

	transaction.makeMoveVec({
		type: '@pkg/qwer::mvr_a::MvrA<@pkg/qwer::mvr_b::V2>',
		elements: [],
	});

	// Adding a move call with regular addresses, to validate that
	// a mix of addresses & names work too (in the same PTB).
	const coin = transaction.moveCall({
		target: '0x2::coin::zero',
		typeArguments: ['0x2::haneul::HANEUL'],
	});

	transaction.transferObjects([coin], normalizeHaneulAddress('0x2'));

	const res = await dryRun(transaction, network);
	expect(res.effects.status.status).toEqual('success');
};

const nestedTypeArgsPtb = async (network: 'mainnet' | 'testnet') => {
	const transaction = new Transaction();

	transaction.addSerializationPlugin(network === 'mainnet' ? mainnetPlugin : testnetPlugin);

	transaction.moveCall({
		target: `@pkg/qwer::mvr_a::noop_with_one_type_param`,
		typeArguments: ['@pkg/qwer::mvr_a::V1'],
	});

	// this combines multiple versions of the same package (v3, v2, v1)
	transaction.moveCall({
		target: `@pkg/qwer::mvr_a::noop_with_two_type_params`,
		typeArguments: ['@pkg/qwer::mvr_a::V1', '@pkg/qwer::mvr_b::V2'],
	});

	const res = await dryRun(transaction, network);
	expect(res.effects.status.status).toEqual('success');
};

const dryRun = async (
	transaction: Transaction,
	network: 'mainnet' | 'testnet',
	withOverrides = false,
) => {
	const client = new HaneulClient({
		url: getFullnodeUrl(network),
		mvr: withOverrides
			? {
					overrides: localMvrOverrides,
				}
			: undefined,
	});

	transaction.setSender(normalizeHaneulAddress('0x2'));

	return client.dryRunTransactionBlock({ transactionBlock: await transaction.build({ client }) });
};
