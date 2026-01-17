// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { TypeTagSerializer } from '../bcs/type-tag-serializer.js';
import type { TransactionPlugin } from '../transactions/index.js';
import { deriveDynamicFieldID } from '../utils/dynamic-fields.js';
import { normalizeStructTag, parseStructTag, HANEUL_ADDRESS_LENGTH } from '../utils/haneul-types.js';
import { Experimental_BaseClient } from './client.js';
import type { ClientWithExtensions, Experimental_HaneulClientTypes } from './types.js';
import { MvrClient } from './mvr.js';

export type ClientWithCoreApi = ClientWithExtensions<{
	core: Experimental_CoreClient;
}>;

export interface Experimental_CoreClientOptions
	extends Experimental_HaneulClientTypes.HaneulClientOptions {
	base: Experimental_BaseClient;
	mvr?: Experimental_HaneulClientTypes.MvrOptions;
}

const DEFAULT_MVR_URLS: Record<string, string> = {
	mainnet: 'https://mainnet.mvr.haneullabs.com',
	testnet: 'https://testnet.mvr.haneullabs.com',
};

export abstract class Experimental_CoreClient
	extends Experimental_BaseClient
	implements Experimental_HaneulClientTypes.TransportMethods
{
	core = this;
	mvr: Experimental_HaneulClientTypes.MvrMethods;

	constructor(options: Experimental_CoreClientOptions) {
		super(options);

		this.mvr = new MvrClient({
			cache: this.cache.scope('core.mvr'),
			url: options.mvr?.url ?? DEFAULT_MVR_URLS[this.network],
			pageSize: options.mvr?.pageSize,
			overrides: options.mvr?.overrides,
		});
	}

	abstract getObjects(
		options: Experimental_HaneulClientTypes.GetObjectsOptions,
	): Promise<Experimental_HaneulClientTypes.GetObjectsResponse>;

	async getObject(
		options: Experimental_HaneulClientTypes.GetObjectOptions,
	): Promise<Experimental_HaneulClientTypes.GetObjectResponse> {
		const { objectId } = options;
		const {
			objects: [result],
		} = await this.getObjects({ objectIds: [objectId], signal: options.signal });
		if (result instanceof Error) {
			throw result;
		}
		return { object: result };
	}

	abstract getCoins(
		options: Experimental_HaneulClientTypes.GetCoinsOptions,
	): Promise<Experimental_HaneulClientTypes.GetCoinsResponse>;

	abstract getOwnedObjects(
		options: Experimental_HaneulClientTypes.GetOwnedObjectsOptions,
	): Promise<Experimental_HaneulClientTypes.GetOwnedObjectsResponse>;

	abstract getBalance(
		options: Experimental_HaneulClientTypes.GetBalanceOptions,
	): Promise<Experimental_HaneulClientTypes.GetBalanceResponse>;

	abstract getAllBalances(
		options: Experimental_HaneulClientTypes.GetAllBalancesOptions,
	): Promise<Experimental_HaneulClientTypes.GetAllBalancesResponse>;

	abstract getTransaction(
		options: Experimental_HaneulClientTypes.GetTransactionOptions,
	): Promise<Experimental_HaneulClientTypes.GetTransactionResponse>;

	abstract executeTransaction(
		options: Experimental_HaneulClientTypes.ExecuteTransactionOptions,
	): Promise<Experimental_HaneulClientTypes.ExecuteTransactionResponse>;

	abstract dryRunTransaction(
		options: Experimental_HaneulClientTypes.DryRunTransactionOptions,
	): Promise<Experimental_HaneulClientTypes.DryRunTransactionResponse>;

	abstract getReferenceGasPrice(
		options?: Experimental_HaneulClientTypes.GetReferenceGasPriceOptions,
	): Promise<Experimental_HaneulClientTypes.GetReferenceGasPriceResponse>;

	abstract getDynamicFields(
		options: Experimental_HaneulClientTypes.GetDynamicFieldsOptions,
	): Promise<Experimental_HaneulClientTypes.GetDynamicFieldsResponse>;

	abstract resolveTransactionPlugin(): TransactionPlugin;

	abstract verifyZkLoginSignature(
		options: Experimental_HaneulClientTypes.VerifyZkLoginSignatureOptions,
	): Promise<Experimental_HaneulClientTypes.ZkLoginVerifyResponse>;

	abstract getMoveFunction(
		options: Experimental_HaneulClientTypes.GetMoveFunctionOptions,
	): Promise<Experimental_HaneulClientTypes.GetMoveFunctionResponse>;

	abstract defaultNameServiceName(
		options: Experimental_HaneulClientTypes.DefaultNameServiceNameOptions,
	): Promise<Experimental_HaneulClientTypes.DefaultNameServiceNameResponse>;

	async getDynamicField(
		options: Experimental_HaneulClientTypes.GetDynamicFieldOptions,
	): Promise<Experimental_HaneulClientTypes.GetDynamicFieldResponse> {
		const normalizedNameType = TypeTagSerializer.parseFromStr(
			(
				await this.core.mvr.resolveType({
					type: options.name.type,
				})
			).type,
		);
		const fieldId = deriveDynamicFieldID(options.parentId, normalizedNameType, options.name.bcs);
		const {
			objects: [fieldObject],
		} = await this.getObjects({
			objectIds: [fieldId],
			signal: options.signal,
		});

		if (fieldObject instanceof Error) {
			throw fieldObject;
		}

		const fieldType = parseStructTag(fieldObject.type);
		const content = await fieldObject.content;

		return {
			dynamicField: {
				id: fieldObject.id,
				digest: fieldObject.digest,
				version: fieldObject.version,
				type: fieldObject.type,
				previousTransaction: fieldObject.previousTransaction,
				name: {
					type:
						typeof fieldType.typeParams[0] === 'string'
							? fieldType.typeParams[0]
							: normalizeStructTag(fieldType.typeParams[0]),
					bcs: options.name.bcs,
				},
				value: {
					type:
						typeof fieldType.typeParams[1] === 'string'
							? fieldType.typeParams[1]
							: normalizeStructTag(fieldType.typeParams[1]),
					bcs: content.slice(HANEUL_ADDRESS_LENGTH + options.name.bcs.length),
				},
			},
		};
	}

	async waitForTransaction({
		signal,
		timeout = 60 * 1000,
		...input
	}: {
		/** An optional abort signal that can be used to cancel the wait. */
		signal?: AbortSignal;
		/** The amount of time to wait for transaction. Defaults to one minute. */
		timeout?: number;
	} & Experimental_HaneulClientTypes.GetTransactionOptions): Promise<Experimental_HaneulClientTypes.GetTransactionResponse> {
		const abortSignal = signal
			? AbortSignal.any([AbortSignal.timeout(timeout), signal])
			: AbortSignal.timeout(timeout);

		const abortPromise = new Promise((_, reject) => {
			abortSignal.addEventListener('abort', () => reject(abortSignal.reason));
		});

		abortPromise.catch(() => {
			// Swallow unhandled rejections that might be thrown after early return
		});

		// eslint-disable-next-line no-constant-condition
		while (true) {
			abortSignal.throwIfAborted();
			try {
				return await this.getTransaction({
					...input,
					signal: abortSignal,
				});
			} catch {
				await Promise.race([new Promise((resolve) => setTimeout(resolve, 2_000)), abortPromise]);
			}
		}
	}
}
