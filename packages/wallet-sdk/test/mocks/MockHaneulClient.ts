// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { Experimental_HaneulClientTypes } from '@haneullabs/haneul/experimental';
import { Experimental_CoreClient } from '@haneullabs/haneul/experimental';
import { normalizeHaneulAddress, normalizeStructTag, parseStructTag } from '@haneullabs/haneul/utils';
import type { TransactionPlugin } from '@haneullabs/haneul/transactions';
import { Inputs } from '@haneullabs/haneul/transactions';
import {
	DEFAULT_OBJECTS,
	DEFAULT_MOVE_FUNCTIONS,
	DEFAULT_GAS_PRICE,
	CoinStruct,
	createMockCoin,
	createMockNFT,
	createMockObject,
	createMockMoveFunction,
} from './mockData.js';

export class MockHaneulClient extends Experimental_CoreClient {
	#objects = new Map<string, Experimental_HaneulClientTypes.ObjectResponse>();
	#moveFunctions = new Map<string, Experimental_HaneulClientTypes.FunctionResponse>();
	#gasPrice = DEFAULT_GAS_PRICE;
	#nextDryRunResult: Experimental_HaneulClientTypes.DryRunTransactionResponse | null = null;

	constructor(network: Experimental_HaneulClientTypes.Network = 'testnet') {
		super({
			network,
			base: null as unknown as Experimental_CoreClient,
		});
		this.base = this;

		this.#initializeDefaults();
	}

	#initializeDefaults() {
		// Add all default objects
		for (const obj of DEFAULT_OBJECTS) {
			this.#objects.set(obj.id, obj);
		}

		// Add all default move functions
		for (const fn of DEFAULT_MOVE_FUNCTIONS) {
			const normalizedPackageId = normalizeHaneulAddress(fn.packageId);
			const key = `${normalizedPackageId}::${fn.moduleName}::${fn.name}`;
			this.#moveFunctions.set(key, fn);
		}
	}

	// Helper methods to add objects during tests
	addCoin(params: {
		objectId: string;
		coinType: string;
		balance: bigint;
		owner: Experimental_HaneulClientTypes.ObjectOwner;
		version?: string;
		digest?: string;
	}): void {
		const coin = createMockCoin(params);
		this.#objects.set(coin.id, coin);
	}

	addNFT(params: {
		objectId: string;
		nftType: string;
		owner: Experimental_HaneulClientTypes.ObjectOwner;
		version?: string;
		digest?: string;
	}): void {
		const nft = createMockNFT(params);
		this.#objects.set(nft.id, nft);
	}

	addObject(params: {
		objectId: string;
		objectType: string;
		owner: Experimental_HaneulClientTypes.ObjectOwner;
		version?: string;
		digest?: string;
		content?: Uint8Array;
	}): void {
		const obj = createMockObject(params);
		this.#objects.set(obj.id, obj);
	}

	addMoveFunction(params: {
		packageId: string;
		moduleName: string;
		name: string;
		visibility: Experimental_HaneulClientTypes.Visibility;
		isEntry: boolean;
		typeParameters?: Experimental_HaneulClientTypes.TypeParameter[];
		parameters: Experimental_HaneulClientTypes.OpenSignature[];
		returns?: Experimental_HaneulClientTypes.OpenSignature[];
	}): void {
		const fn = createMockMoveFunction(params);
		const normalizedPackageId = normalizeHaneulAddress(fn.packageId);
		const key = `${normalizedPackageId}::${fn.moduleName}::${fn.name}`;
		this.#moveFunctions.set(key, fn);
	}

	setNextDryRunResult(result: Experimental_HaneulClientTypes.DryRunTransactionResponse): void {
		this.#nextDryRunResult = result;
	}

	setGasPrice(price: string): void {
		this.#gasPrice = price;
	}

	// Helper function to check if an object is owned by the given address
	#isOwnedByAddress(obj: Experimental_HaneulClientTypes.ObjectResponse, address: string): boolean {
		switch (obj.owner.$kind) {
			case 'AddressOwner':
				return obj.owner.AddressOwner === address;
			case 'ObjectOwner':
				return obj.owner.ObjectOwner === address;
			case 'ConsensusAddressOwner':
				return obj.owner.ConsensusAddressOwner.owner === address;
			case 'Shared':
			case 'Immutable':
			case 'Unknown':
			default:
				return false;
		}
	}

	async getObjects(
		options: Experimental_HaneulClientTypes.GetObjectsOptions,
	): Promise<Experimental_HaneulClientTypes.GetObjectsResponse> {
		const objects = options.objectIds.map(
			(id): Experimental_HaneulClientTypes.ObjectResponse | Error => {
				const normalizedId = normalizeHaneulAddress(id);
				const obj = this.#objects.get(normalizedId);

				if (!obj) {
					return new Error(`Object not found: ${id}`);
				}

				return obj;
			},
		);

		return { objects };
	}

	async getCoins(
		options: Experimental_HaneulClientTypes.GetCoinsOptions,
	): Promise<Experimental_HaneulClientTypes.GetCoinsResponse> {
		const coinObjects = Array.from(this.#objects.values()).filter((obj) => {
			const parsedType = parseStructTag(obj.type);
			const parsedCoinType = parseStructTag('0x2::coin::Coin');

			const isCoin =
				parsedType.address === parsedCoinType.address &&
				parsedType.module === parsedCoinType.module &&
				parsedType.name === parsedCoinType.name;

			if (!isCoin) return false;

			// Filter by owner using helper function
			const isOwnedByAddress = this.#isOwnedByAddress(obj, options.address);
			if (!isOwnedByAddress) return false;

			// Filter by coin type
			const coinType = obj.type.match(/0x2::coin::Coin<(.+)>/)?.[1];
			return coinType === options.coinType;
		});

		const objects: Experimental_HaneulClientTypes.CoinResponse[] = await Promise.all(
			coinObjects.map(async (obj) => {
				// Parse balance from BCS content
				let balance = '0';
				try {
					const content = await obj.content;
					const parsedCoin = CoinStruct.parse(content);
					balance = parsedCoin.balance.value.toString();
				} catch {
					// Fallback to 0 if parsing fails
				}

				return {
					...obj,
					balance,
				};
			}),
		);

		return {
			objects,
			hasNextPage: false,
			cursor: null,
		};
	}

	async getOwnedObjects(
		options: Experimental_HaneulClientTypes.GetOwnedObjectsOptions,
	): Promise<Experimental_HaneulClientTypes.GetOwnedObjectsResponse> {
		const ownedObjects = Array.from(this.#objects.values()).filter((obj) => {
			return this.#isOwnedByAddress(obj, options.address);
		});

		return {
			objects: ownedObjects,
			hasNextPage: false,
			cursor: null,
		};
	}

	async getBalance(
		options: Experimental_HaneulClientTypes.GetBalanceOptions,
	): Promise<Experimental_HaneulClientTypes.GetBalanceResponse> {
		const coins = await this.getCoins({
			address: options.address,
			coinType: options.coinType,
		});

		const totalBalance = coins.objects.reduce(
			(sum: bigint, coin: Experimental_HaneulClientTypes.CoinResponse) => {
				return sum + BigInt(coin.balance);
			},
			0n,
		);

		return {
			balance: {
				coinType: options.coinType,
				balance: totalBalance.toString(),
			},
		};
	}

	async getAllBalances(
		options: Experimental_HaneulClientTypes.GetAllBalancesOptions,
	): Promise<Experimental_HaneulClientTypes.GetAllBalancesResponse> {
		const parsedCoinType = parseStructTag('0x2::coin::Coin');
		const allObjects = Array.from(this.#objects.values()).filter((obj) => {
			const parsedType = parseStructTag(obj.type);

			const isCoin =
				parsedType.address === parsedCoinType.address &&
				parsedType.module === parsedCoinType.module &&
				parsedType.name === parsedCoinType.name;
			const isOwnedByAddress = this.#isOwnedByAddress(obj, options.address);
			return isCoin && isOwnedByAddress;
		});

		const balancesByType = new Map<string, bigint>();

		for (const obj of allObjects) {
			const coinType = obj.type.match(/0x2::coin::Coin<(.+)>/)?.[1];
			if (!coinType) continue;

			try {
				const content = await obj.content;
				const parsedCoin = CoinStruct.parse(content);
				const balance = BigInt(parsedCoin.balance.value);
				const current = balancesByType.get(coinType) || 0n;
				balancesByType.set(coinType, current + balance);
			} catch {
				// Skip if parsing fails
			}
		}

		const balances: Experimental_HaneulClientTypes.CoinBalance[] = Array.from(
			balancesByType.entries(),
		).map(([coinType, totalBalance]) => ({
			coinType,
			balance: totalBalance.toString(),
		}));

		return {
			balances,
			hasNextPage: false,
			cursor: null,
		};
	}

	async getTransaction(
		_options: Experimental_HaneulClientTypes.GetTransactionOptions,
	): Promise<Experimental_HaneulClientTypes.GetTransactionResponse> {
		throw new Error('getTransaction not implemented in MockHaneulClient');
	}

	async executeTransaction(
		_options: Experimental_HaneulClientTypes.ExecuteTransactionOptions,
	): Promise<Experimental_HaneulClientTypes.ExecuteTransactionResponse> {
		throw new Error('executeTransaction not implemented in MockHaneulClient');
	}

	async defaultNameServiceName(
		_options: Experimental_HaneulClientTypes.DefaultNameServiceNameOptions,
	): Promise<Experimental_HaneulClientTypes.DefaultNameServiceNameResponse> {
		throw new Error('defaultNameServiceName not implemented in MockHaneulClient');
	}

	async dryRunTransaction(
		_options: Experimental_HaneulClientTypes.DryRunTransactionOptions,
	): Promise<Experimental_HaneulClientTypes.DryRunTransactionResponse> {
		if (this.#nextDryRunResult) {
			const result = this.#nextDryRunResult;
			this.#nextDryRunResult = null;
			return result;
		}

		// Default dry run response - minimal valid structure
		return {
			transaction: {
				digest: 'mockTransactionDigest',
				signatures: [],
				epoch: '1',
				effects: {
					bcs: new Uint8Array(),
					digest: 'mockEffectsDigest',
					version: 1,
					transactionDigest: 'mockTransactionDigest',
					status: { success: true, error: null },
					gasUsed: {
						computationCost: '100000',
						storageCost: '100000',
						storageRebate: '0',
						nonRefundableStorageFee: '0',
					},
					gasObject: {
						id: normalizeHaneulAddress('0xa5c01'),
						inputState: 'Exists',
						inputVersion: '100',
						inputDigest: '11111111111111111111111111111111',
						inputOwner: {
							$kind: 'AddressOwner',
							AddressOwner: '0x0000000000000000000000000000000000000000000000000000000000000123',
						},
						outputState: 'ObjectWrite',
						outputVersion: '101',
						outputDigest: '11111111111111111111111111111112',
						outputOwner: {
							$kind: 'AddressOwner',
							AddressOwner: '0x0000000000000000000000000000000000000000000000000000000000000123',
						},
						idOperation: 'None',
					},
					eventsDigest: null,
					dependencies: [],
					lamportVersion: '1',
					changedObjects: [],
					unchangedConsensusObjects: [],
					auxiliaryDataDigest: null,
				},
				objectTypes: Promise.resolve({}),
				transaction: {
					bcs: new Uint8Array(),
				} as Experimental_HaneulClientTypes.TransactionData,
				balanceChanges: [],
			},
		};
	}

	async getReferenceGasPrice(
		_options?: Experimental_HaneulClientTypes.GetReferenceGasPriceOptions,
	): Promise<Experimental_HaneulClientTypes.GetReferenceGasPriceResponse> {
		return { referenceGasPrice: this.#gasPrice };
	}

	async getDynamicFields(
		_options: Experimental_HaneulClientTypes.GetDynamicFieldsOptions,
	): Promise<Experimental_HaneulClientTypes.GetDynamicFieldsResponse> {
		return {
			dynamicFields: [],
			hasNextPage: false,
			cursor: null,
		};
	}

	resolveTransactionPlugin(): TransactionPlugin {
		// For mock purposes, return a plugin that automatically sets up gas configuration and resolves objects
		return async (transactionData, _options, next) => {
			// Resolve UnresolvedObject inputs
			await this.#resolveObjectReferences(transactionData);

			// Set up gas configuration if not already set
			if (!transactionData.gasData.budget) {
				transactionData.gasData.budget = '10000000';
			}
			if (!transactionData.gasData.price) {
				transactionData.gasData.price = this.#gasPrice;
			}
			if (!transactionData.gasData.payment || transactionData.gasData.payment.length === 0) {
				// Use the first SUI coin from default objects
				const suiCoinType = normalizeStructTag('0x2::coin::Coin<0x2::haneul::HANEUL>');
				const firstSuiCoin = Array.from(this.#objects.values()).find(
					(obj) =>
						obj.type === suiCoinType &&
						obj.owner.$kind === 'AddressOwner' &&
						obj.owner.AddressOwner === transactionData.sender,
				);

				if (firstSuiCoin) {
					transactionData.gasData.payment = [
						{
							objectId: firstSuiCoin.id,
							version: firstSuiCoin.version,
							digest: firstSuiCoin.digest,
						},
					];
					transactionData.gasData.owner = transactionData.sender;
				}
			}

			// Proceed to the next plugin
			await next();
		};
	}

	async #resolveObjectReferences(transactionData: {
		inputs: Array<{
			UnresolvedObject?: {
				objectId: string;
				version?: string | number | null;
				initialSharedVersion?: string | number | null;
				mutable?: boolean | null;
			};
			[key: string]: unknown;
		}>;
	}) {
		// Find all UnresolvedObject inputs that need resolution
		const objectsToResolve = transactionData.inputs.filter((input) => {
			return (
				input.UnresolvedObject &&
				!(input.UnresolvedObject.version || input.UnresolvedObject?.initialSharedVersion)
			);
		});

		if (objectsToResolve.length === 0) {
			return;
		}

		// Get unique object IDs
		const dedupedIds = [
			...new Set(
				objectsToResolve.map((input) => normalizeHaneulAddress(input.UnresolvedObject!.objectId)),
			),
		] as string[];

		// Fetch objects using our multiGetObjects
		const resolved = await this.getObjects({ objectIds: dedupedIds });

		const objectsById = new Map(dedupedIds.map((id, index) => [id, resolved.objects[index]]));

		// Update each UnresolvedObject input
		for (const [index, input] of transactionData.inputs.entries()) {
			if (!input.UnresolvedObject) {
				continue;
			}

			const id = normalizeHaneulAddress(input.UnresolvedObject.objectId);
			const resolvedObject = objectsById.get(id);

			if (!resolvedObject || resolvedObject instanceof Error) {
				throw new Error(`Failed to resolve object: ${id}`);
			}

			// Determine the type of reference based on owner
			if (resolvedObject.owner.$kind === 'Shared') {
				transactionData.inputs[index] = Inputs.SharedObjectRef({
					objectId: id,
					initialSharedVersion: resolvedObject.owner.Shared.initialSharedVersion,
					mutable: input.UnresolvedObject.mutable ?? true,
				});
			} else {
				// For owned objects, use ObjectRef
				transactionData.inputs[index] = Inputs.ObjectRef({
					objectId: id,
					digest: resolvedObject.digest,
					version: resolvedObject.version,
				});
			}
		}
	}

	async verifyZkLoginSignature(
		_options: Experimental_HaneulClientTypes.VerifyZkLoginSignatureOptions,
	): Promise<Experimental_HaneulClientTypes.ZkLoginVerifyResponse> {
		throw new Error('verifyZkLoginSignature not implemented in MockHaneulClient');
	}

	async getMoveFunction(
		options: Experimental_HaneulClientTypes.GetMoveFunctionOptions,
	): Promise<Experimental_HaneulClientTypes.GetMoveFunctionResponse> {
		const normalizedPackageId = normalizeHaneulAddress(options.packageId);
		const key = `${normalizedPackageId}::${options.moduleName}::${options.name}`;
		const fn = this.#moveFunctions.get(key);

		if (!fn) {
			throw new Error(`Move function not found: ${key}`);
		}

		return { function: fn };
	}
}
