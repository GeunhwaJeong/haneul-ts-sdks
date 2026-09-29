// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { GrpcWebOptions } from '@protobuf-ts/grpcweb-transport';
import { TransactionExecutionServiceClient } from './proto/haneul/rpc/v2/transaction_execution_service.client.js';
import { LedgerServiceClient } from './proto/haneul/rpc/v2/ledger_service.client.js';
import { MovePackageServiceClient } from './proto/haneul/rpc/v2/move_package_service.client.js';
import { SignatureVerificationServiceClient } from './proto/haneul/rpc/v2/signature_verification_service.client.js';
import type { RpcTransport } from '@protobuf-ts/runtime-rpc';
import { StateServiceClient } from './proto/haneul/rpc/v2/state_service.client.js';
import { SubscriptionServiceClient } from './proto/haneul/rpc/v2/subscription_service.client.js';
import { GrpcCoreClient } from './core.js';
import type { HaneulClientTypes } from '../client/index.js';
import { BaseClient } from '../client/index.js';
import { DynamicField_DynamicFieldKind } from './proto/haneul/rpc/v2/state_service.js';
import { normalizeStructTag } from '../utils/haneul-types.js';
import { fromBase64, toBase64 } from '@haneullabs/utils';
import { NameServiceClient } from './proto/haneul/rpc/v2/name_service.client.js';
import { ForkingServiceClient } from './proto/haneul/forking/v1alpha/forking_service.client.js';
import type { TransactionPlugin } from '../transactions/index.js';
import { GrpcWebFetchTransport, withClientProtocolVersion } from './transport.js';

interface HaneulGrpcTransportOptions extends GrpcWebOptions {
	transport?: never;
}

export type HaneulGrpcClientOptions = {
	network: HaneulClientTypes.Network;
	mvr?: HaneulClientTypes.MvrOptions;
} & (
	| {
			transport: RpcTransport;
	  }
	| HaneulGrpcTransportOptions
);

const HANEUL_CLIENT_BRAND = Symbol.for('@haneullabs/HaneulGrpcClient') as never;

export function isHaneulGrpcClient(client: unknown): client is HaneulGrpcClient {
	return (
		typeof client === 'object' && client !== null && (client as any)[HANEUL_CLIENT_BRAND] === true
	);
}

export interface DynamicFieldInclude {
	value?: boolean;
}

export type DynamicFieldEntryWithValue<Include extends DynamicFieldInclude = {}> =
	HaneulClientTypes.DynamicFieldEntry & {
		value: Include extends { value: true } ? HaneulClientTypes.DynamicFieldValue : undefined;
	};

export interface ListDynamicFieldsWithValueResponse<Include extends DynamicFieldInclude = {}> {
	hasNextPage: boolean;
	cursor: string | null;
	dynamicFields: DynamicFieldEntryWithValue<Include>[];
}

export interface GrpcTransactionInclude extends HaneulClientTypes.TransactionInclude {
	/** Include the parsed protobuf JSON value for the gRPC transaction response. */
	protoJson?: boolean;
}

export interface GrpcSimulateTransactionInclude extends HaneulClientTypes.SimulateTransactionInclude {
	/** Include the parsed protobuf JSON value for the gRPC simulation response. */
	protoJson?: boolean;
}

export type GrpcTransactionProtoJson = ReturnType<
	typeof import('./proto/haneul/rpc/v2/executed_transaction.js').ExecutedTransaction.toJson
>;

export type GrpcSimulateTransactionProtoJson = ReturnType<
	typeof import('./proto/haneul/rpc/v2/transaction_execution_service.js').SimulateTransactionResponse.toJson
>;

type ProtoJson<Include extends { protoJson?: boolean }, Json> = Include['protoJson'] extends true
	? Json
	: undefined;

export type GrpcTransactionResult<Include extends GrpcTransactionInclude = {}> =
	HaneulClientTypes.TransactionResult<Include> & {
		protoJson: ProtoJson<Include, GrpcTransactionProtoJson>;
	};

export type GrpcSimulateTransactionResult<Include extends GrpcSimulateTransactionInclude = {}> =
	HaneulClientTypes.SimulateTransactionResult<Include> & {
		protoJson: ProtoJson<Include, GrpcSimulateTransactionProtoJson>;
	};

export interface GrpcGetTransactionOptions<
	Include extends GrpcTransactionInclude = {},
> extends HaneulClientTypes.GetTransactionOptions<Include> {
	include?: Include & GrpcTransactionInclude;
}

export interface GrpcWaitForTransactionByDigest<
	Include extends GrpcTransactionInclude = {},
> extends HaneulClientTypes.WaitForTransactionByDigest<Include> {
	include?: Include & GrpcTransactionInclude;
}

export interface GrpcWaitForTransactionByResult<
	Include extends GrpcTransactionInclude = {},
> extends HaneulClientTypes.WaitForTransactionByResult<Include> {
	include?: Include & GrpcTransactionInclude;
}

export type GrpcWaitForTransactionOptions<Include extends GrpcTransactionInclude = {}> =
	GrpcWaitForTransactionByDigest<Include> | GrpcWaitForTransactionByResult<Include>;

export interface GrpcExecuteTransactionOptions<
	Include extends GrpcTransactionInclude = {},
> extends HaneulClientTypes.ExecuteTransactionOptions<Include> {
	include?: Include & GrpcTransactionInclude;
}

export interface GrpcSignAndExecuteTransactionOptions<
	Include extends GrpcTransactionInclude = {},
> extends HaneulClientTypes.SignAndExecuteTransactionOptions<Include> {
	include?: Include & GrpcTransactionInclude;
}

export interface GrpcSimulateTransactionOptions<
	Include extends GrpcSimulateTransactionInclude = {},
> extends HaneulClientTypes.SimulateTransactionOptions<Include> {
	include?: Include & GrpcSimulateTransactionInclude;
	/**
	 * Overrides whether the server selects gas payment during simulation.
	 *
	 * When not set, gas selection is enabled only when the transaction's gas payment is explicitly
	 * set to an empty list (`[]`), which indicates gas is paid from the sender's address balance.
	 * Transactions with gas coins set are simulated as-is, and transactions without a gas payment
	 * are simulated with a mocked gas coin.
	 */
	doGasSelection?: boolean;
}

export class HaneulGrpcClient extends BaseClient implements HaneulClientTypes.TransportMethods {
	core: GrpcCoreClient;
	get mvr(): HaneulClientTypes.MvrMethods {
		return this.core.mvr;
	}
	transactionExecutionService: TransactionExecutionServiceClient;
	ledgerService: LedgerServiceClient;
	stateService: StateServiceClient;
	subscriptionService: SubscriptionServiceClient;
	movePackageService: MovePackageServiceClient;
	signatureVerificationService: SignatureVerificationServiceClient;
	nameService: NameServiceClient;
	forkingService: ForkingServiceClient;

	get [HANEUL_CLIENT_BRAND]() {
		return true;
	}

	constructor(options: HaneulGrpcClientOptions) {
		super({ network: options.network });
		const {
			network: _network,
			mvr: _mvr,
			// Not forwarded: every Core API call passes its own `signal`, which would overwrite it.
			abort: _abort,
			transport: providedTransport,
			...transportOptions
		} = options as HaneulGrpcClientOptions & HaneulGrpcTransportOptions & { transport?: RpcTransport };

		// Add the protocol-version default for every transport, including native gRPC.
		const transport = withClientProtocolVersion(
			providedTransport ?? new GrpcWebFetchTransport(transportOptions),
		);
		this.transactionExecutionService = new TransactionExecutionServiceClient(transport);
		this.ledgerService = new LedgerServiceClient(transport);
		this.stateService = new StateServiceClient(transport);
		this.subscriptionService = new SubscriptionServiceClient(transport);
		this.movePackageService = new MovePackageServiceClient(transport);
		this.signatureVerificationService = new SignatureVerificationServiceClient(transport);
		this.nameService = new NameServiceClient(transport);
		this.forkingService = new ForkingServiceClient(transport);

		this.core = new GrpcCoreClient({
			client: this,
			base: this,
			network: options.network,
			mvr: options.mvr,
		});
	}

	getObjects<Include extends HaneulClientTypes.ObjectInclude = {}>(
		input: HaneulClientTypes.GetObjectsOptions<Include>,
	): Promise<HaneulClientTypes.GetObjectsResponse<Include>> {
		return this.core.getObjects(input);
	}

	getObject<Include extends HaneulClientTypes.ObjectInclude = {}>(
		input: HaneulClientTypes.GetObjectOptions<Include>,
	): Promise<HaneulClientTypes.GetObjectResponse<Include>> {
		return this.core.getObject(input);
	}

	listCoins(input: HaneulClientTypes.ListCoinsOptions): Promise<HaneulClientTypes.ListCoinsResponse> {
		return this.core.listCoins(input);
	}

	listOwnedObjects<Include extends HaneulClientTypes.ObjectInclude = {}>(
		input: HaneulClientTypes.ListOwnedObjectsOptions<Include>,
	): Promise<HaneulClientTypes.ListOwnedObjectsResponse<Include>> {
		return this.core.listOwnedObjects(input);
	}

	getBalance(input: HaneulClientTypes.GetBalanceOptions): Promise<HaneulClientTypes.GetBalanceResponse> {
		return this.core.getBalance(input);
	}

	listBalances(
		input: HaneulClientTypes.ListBalancesOptions,
	): Promise<HaneulClientTypes.ListBalancesResponse> {
		return this.core.listBalances(input);
	}

	getCoinMetadata(
		input: HaneulClientTypes.GetCoinMetadataOptions,
	): Promise<HaneulClientTypes.GetCoinMetadataResponse> {
		return this.core.getCoinMetadata(input);
	}

	getTransaction<Include extends GrpcTransactionInclude = {}>(
		input: GrpcGetTransactionOptions<Include>,
	): Promise<GrpcTransactionResult<Include>> {
		return this.core.getTransaction(input) as Promise<GrpcTransactionResult<Include>>;
	}

	executeTransaction<Include extends GrpcTransactionInclude = {}>(
		input: GrpcExecuteTransactionOptions<Include>,
	): Promise<GrpcTransactionResult<Include>> {
		return this.core.executeTransaction(input) as Promise<GrpcTransactionResult<Include>>;
	}

	signAndExecuteTransaction<Include extends GrpcTransactionInclude = {}>(
		input: GrpcSignAndExecuteTransactionOptions<Include>,
	): Promise<GrpcTransactionResult<Include>> {
		return this.core.signAndExecuteTransaction(input) as Promise<GrpcTransactionResult<Include>>;
	}

	waitForTransaction<Include extends GrpcTransactionInclude = {}>(
		input: GrpcWaitForTransactionOptions<Include>,
	): Promise<GrpcTransactionResult<Include>> {
		return this.core.waitForTransaction(input) as Promise<GrpcTransactionResult<Include>>;
	}

	simulateTransaction<Include extends GrpcSimulateTransactionInclude = {}>(
		input: GrpcSimulateTransactionOptions<Include>,
	): Promise<GrpcSimulateTransactionResult<Include>> {
		return this.core.simulateTransaction(input) as Promise<GrpcSimulateTransactionResult<Include>>;
	}

	getReferenceGasPrice(
		input?: HaneulClientTypes.GetReferenceGasPriceOptions,
	): Promise<HaneulClientTypes.GetReferenceGasPriceResponse> {
		return this.core.getReferenceGasPrice(input);
	}

	getCurrentSystemState(
		input?: HaneulClientTypes.GetCurrentSystemStateOptions,
	): Promise<HaneulClientTypes.GetCurrentSystemStateResponse> {
		return this.core.getCurrentSystemState(input);
	}

	getProtocolConfig(
		input?: HaneulClientTypes.GetProtocolConfigOptions,
	): Promise<HaneulClientTypes.GetProtocolConfigResponse> {
		return this.core.getProtocolConfig(input);
	}

	getChainIdentifier(
		input?: HaneulClientTypes.GetChainIdentifierOptions,
	): Promise<HaneulClientTypes.GetChainIdentifierResponse> {
		return this.core.getChainIdentifier(input);
	}

	async listDynamicFields<Include extends DynamicFieldInclude = {}>(
		input: HaneulClientTypes.ListDynamicFieldsOptions & { include?: Include & DynamicFieldInclude },
	): Promise<ListDynamicFieldsWithValueResponse<Include>> {
		const includeValue = input.include?.value ?? false;
		const paths = ['field_id', 'name', 'value_type', 'kind', 'child_id'];
		if (includeValue) {
			paths.push('value');
		}

		const response = await this.stateService.listDynamicFields(
			{
				parent: input.parentId,
				pageToken: input.cursor ? fromBase64(input.cursor) : undefined,
				pageSize: input.limit,
				readMask: {
					paths,
				},
			},
			{ abort: input.signal },
		);

		return {
			dynamicFields: response.response.dynamicFields.map(
				(field): DynamicFieldEntryWithValue<Include> => {
					const isDynamicObject = field.kind === DynamicField_DynamicFieldKind.OBJECT;
					const fieldType = isDynamicObject
						? `0x2::dynamic_field::Field<0x2::dynamic_object_field::Wrapper<${field.name?.name!}>,0x2::object::ID>`
						: `0x2::dynamic_field::Field<${field.name?.name!},${field.valueType!}>`;
					return {
						$kind: isDynamicObject ? 'DynamicObject' : 'DynamicField',
						fieldId: field.fieldId!,
						name: {
							type: field.name?.name!,
							bcs: field.name?.value!,
						},
						valueType: field.valueType!,
						type: normalizeStructTag(fieldType),
						childId: field.childId,
						value: (includeValue
							? { type: field.valueType!, bcs: field.value?.value ?? new Uint8Array() }
							: undefined) as DynamicFieldEntryWithValue<Include>['value'],
					} as DynamicFieldEntryWithValue<Include>;
				},
			),
			cursor: response.response.nextPageToken ? toBase64(response.response.nextPageToken) : null,
			hasNextPage: response.response.nextPageToken !== undefined,
		};
	}

	getDynamicField(
		input: HaneulClientTypes.GetDynamicFieldOptions,
	): Promise<HaneulClientTypes.GetDynamicFieldResponse> {
		return this.core.getDynamicField(input);
	}

	getDynamicObjectField<Include extends HaneulClientTypes.ObjectInclude = {}>(
		input: HaneulClientTypes.GetDynamicObjectFieldOptions<Include>,
	): Promise<HaneulClientTypes.GetDynamicObjectFieldResponse<Include>> {
		return this.core.getDynamicObjectField(input);
	}

	listTransactions<Include extends HaneulClientTypes.TransactionInclude = {}>(
		input: HaneulClientTypes.ListTransactionsOptions<Include>,
	): Promise<HaneulClientTypes.ListTransactionsResponse<Include>> {
		return this.core.listTransactions(input);
	}

	listEvents(input: HaneulClientTypes.ListEventsOptions): Promise<HaneulClientTypes.ListEventsResponse> {
		return this.core.listEvents(input);
	}

	getMoveFunction(
		input: HaneulClientTypes.GetMoveFunctionOptions,
	): Promise<HaneulClientTypes.GetMoveFunctionResponse> {
		return this.core.getMoveFunction(input);
	}

	resolveTransactionPlugin(): TransactionPlugin {
		return this.core.resolveTransactionPlugin();
	}

	verifyZkLoginSignature(
		input: HaneulClientTypes.VerifyZkLoginSignatureOptions,
	): Promise<HaneulClientTypes.ZkLoginVerifyResponse> {
		return this.core.verifyZkLoginSignature(input);
	}

	defaultNameServiceName(
		input: HaneulClientTypes.DefaultNameServiceNameOptions,
	): Promise<HaneulClientTypes.DefaultNameServiceNameResponse> {
		return this.core.defaultNameServiceName(input);
	}

	resolveNameServiceAddress(
		input: HaneulClientTypes.ResolveNameServiceAddressOptions,
	): Promise<HaneulClientTypes.ResolveNameServiceAddressResponse> {
		return this.core.resolveNameServiceAddress(input);
	}
}
