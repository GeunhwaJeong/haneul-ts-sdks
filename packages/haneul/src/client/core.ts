// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { TypeTagSerializer } from '../bcs/type-tag-serializer.js';
import type { TransactionPlugin } from '../transactions/index.js';
import { deriveDynamicFieldID } from '../utils/dynamic-fields.js';
import { normalizeStructTag, parseStructTag, HANEUL_ADDRESS_LENGTH } from '../utils/haneul-types.js';
import { BaseClient } from './client.js';
import type { ClientWithExtensions, HaneulClientTypes } from './types.js';
import { MvrClient } from './mvr.js';
import { bcs } from '../bcs/index.js';

export type ClientWithCoreApi = ClientWithExtensions<{
	core: CoreClient;
}>;

export interface CoreClientOptions extends HaneulClientTypes.HaneulClientOptions {
	base: BaseClient;
	mvr?: HaneulClientTypes.MvrOptions;
}

const DEFAULT_MVR_URLS: Record<string, string> = {
	mainnet: 'https://mainnet.mvr.haneul-labs.com',
	testnet: 'https://testnet.mvr.haneul-labs.com',
};

export abstract class CoreClient extends BaseClient implements HaneulClientTypes.TransportMethods {
	core = this;
	mvr: HaneulClientTypes.MvrMethods;

	constructor(options: CoreClientOptions) {
		super(options);

		this.mvr = new MvrClient({
			cache: this.cache.scope('core.mvr'),
			url: options.mvr?.url ?? DEFAULT_MVR_URLS[this.network],
			pageSize: options.mvr?.pageSize,
			overrides: options.mvr?.overrides,
		});
	}

	abstract getObjects<Include extends HaneulClientTypes.ObjectInclude = object>(
		options: HaneulClientTypes.GetObjectsOptions<Include>,
	): Promise<HaneulClientTypes.GetObjectsResponse<Include>>;

	async getObject<Include extends HaneulClientTypes.ObjectInclude = object>(
		options: HaneulClientTypes.GetObjectOptions<Include>,
	): Promise<HaneulClientTypes.GetObjectResponse<Include>> {
		const { objectId } = options;
		const {
			objects: [result],
		} = await this.getObjects({
			objectIds: [objectId],
			signal: options.signal,
			include: options.include,
		});
		if (result instanceof Error) {
			throw result;
		}
		return { object: result };
	}

	abstract listCoins(
		options: HaneulClientTypes.ListCoinsOptions,
	): Promise<HaneulClientTypes.ListCoinsResponse>;

	abstract listOwnedObjects<Include extends HaneulClientTypes.ObjectInclude = object>(
		options: HaneulClientTypes.ListOwnedObjectsOptions<Include>,
	): Promise<HaneulClientTypes.ListOwnedObjectsResponse<Include>>;

	abstract getBalance(
		options: HaneulClientTypes.GetBalanceOptions,
	): Promise<HaneulClientTypes.GetBalanceResponse>;

	abstract listBalances(
		options: HaneulClientTypes.ListBalancesOptions,
	): Promise<HaneulClientTypes.ListBalancesResponse>;

	abstract getCoinMetadata(
		options: HaneulClientTypes.GetCoinMetadataOptions,
	): Promise<HaneulClientTypes.GetCoinMetadataResponse>;

	abstract getTransaction<Include extends HaneulClientTypes.TransactionInclude = object>(
		options: HaneulClientTypes.GetTransactionOptions<Include>,
	): Promise<HaneulClientTypes.TransactionResult<Include>>;

	abstract executeTransaction<Include extends HaneulClientTypes.TransactionInclude = object>(
		options: HaneulClientTypes.ExecuteTransactionOptions<Include>,
	): Promise<HaneulClientTypes.TransactionResult<Include>>;

	abstract simulateTransaction<Include extends HaneulClientTypes.SimulateTransactionInclude = object>(
		options: HaneulClientTypes.SimulateTransactionOptions<Include>,
	): Promise<HaneulClientTypes.SimulateTransactionResult<Include>>;

	abstract getReferenceGasPrice(
		options?: HaneulClientTypes.GetReferenceGasPriceOptions,
	): Promise<HaneulClientTypes.GetReferenceGasPriceResponse>;

	abstract getCurrentSystemState(
		options?: HaneulClientTypes.GetCurrentSystemStateOptions,
	): Promise<HaneulClientTypes.GetCurrentSystemStateResponse>;

	abstract getChainIdentifier(
		options?: HaneulClientTypes.GetChainIdentifierOptions,
	): Promise<HaneulClientTypes.GetChainIdentifierResponse>;

	abstract listDynamicFields(
		options: HaneulClientTypes.ListDynamicFieldsOptions,
	): Promise<HaneulClientTypes.ListDynamicFieldsResponse>;

	abstract resolveTransactionPlugin(): TransactionPlugin;

	abstract verifyZkLoginSignature(
		options: HaneulClientTypes.VerifyZkLoginSignatureOptions,
	): Promise<HaneulClientTypes.ZkLoginVerifyResponse>;

	abstract getMoveFunction(
		options: HaneulClientTypes.GetMoveFunctionOptions,
	): Promise<HaneulClientTypes.GetMoveFunctionResponse>;

	abstract defaultNameServiceName(
		options: HaneulClientTypes.DefaultNameServiceNameOptions,
	): Promise<HaneulClientTypes.DefaultNameServiceNameResponse>;

	async getDynamicField(
		options: HaneulClientTypes.GetDynamicFieldOptions,
	): Promise<HaneulClientTypes.GetDynamicFieldResponse> {
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
			include: {
				previousTransaction: true,
				content: true,
			},
		});

		if (fieldObject instanceof Error) {
			throw fieldObject;
		}

		const fieldType = parseStructTag(fieldObject.type);
		const content = await fieldObject.content;

		return {
			dynamicField: {
				fieldId: fieldObject.objectId,
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

	async getDynamicObjectField<Include extends HaneulClientTypes.ObjectInclude = object>(
		options: HaneulClientTypes.GetDynamicObjectFieldOptions<Include>,
	): Promise<HaneulClientTypes.GetDynamicObjectFieldResponse<Include>> {
		const resolvedNameType = (
			await this.core.mvr.resolveType({
				type: options.name.type,
			})
		).type;
		const wrappedType = `0x2::dynamic_object_field::Wrapper<${resolvedNameType}>`;

		const { dynamicField } = await this.getDynamicField({
			parentId: options.parentId,
			name: {
				type: wrappedType,
				bcs: options.name.bcs,
			},
			signal: options.signal,
		});

		const { object } = await this.getObject({
			objectId: bcs.Address.parse(dynamicField.value.bcs),
			signal: options.signal,
			include: options.include,
		});

		return { object };
	}

	async waitForTransaction<Include extends HaneulClientTypes.TransactionInclude = object>(
		options: HaneulClientTypes.WaitForTransactionOptions<Include>,
	): Promise<HaneulClientTypes.TransactionResult<Include>> {
		const { signal, timeout = 60 * 1000, include } = options;

		const digest =
			'result' in options && options.result
				? (options.result.Transaction ?? options.result.FailedTransaction)!.digest
				: options.digest;

		const abortSignal = signal
			? AbortSignal.any([AbortSignal.timeout(timeout), signal])
			: AbortSignal.timeout(timeout);

		const abortPromise = new Promise((_, reject) => {
			abortSignal.addEventListener('abort', () => reject(abortSignal.reason));
		});

		abortPromise.catch(() => {
			// Swallow unhandled rejections that might be thrown after early return
		});

		while (true) {
			abortSignal.throwIfAborted();
			try {
				return await this.getTransaction({
					digest,
					include,
					signal: abortSignal,
				});
			} catch {
				await Promise.race([new Promise((resolve) => setTimeout(resolve, 2_000)), abortPromise]);
			}
		}
	}

	async signAndExecuteTransaction<Include extends HaneulClientTypes.TransactionInclude = {}>({
		transaction,
		signer,
		additionalSignatures = [],
		...input
	}: HaneulClientTypes.SignAndExecuteTransactionOptions<Include>): Promise<
		HaneulClientTypes.TransactionResult<Include>
	> {
		let transactionBytes;

		if (transaction instanceof Uint8Array) {
			transactionBytes = transaction;
		} else {
			transaction.setSenderIfNotSet(signer.toSuiAddress());
			transactionBytes = await transaction.build({ client: this });
		}

		const { signature } = await signer.signTransaction(transactionBytes);

		return this.executeTransaction({
			transaction: transactionBytes,
			signatures: [signature, ...additionalSignatures],
			...input,
		});
	}
}
