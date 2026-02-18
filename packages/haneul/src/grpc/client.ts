// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { GrpcWebOptions } from '@protobuf-ts/grpcweb-transport';
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
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
import { NameServiceClient } from './proto/haneul/rpc/v2/name_service.client.js';
import type { TransactionPlugin } from '../transactions/index.js';

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

const SUI_CLIENT_BRAND = Symbol.for('@haneullabs/HaneulGrpcClient') as never;

export function isSuiGrpcClient(client: unknown): client is HaneulGrpcClient {
	return (
		typeof client === 'object' && client !== null && (client as any)[SUI_CLIENT_BRAND] === true
	);
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

	get [SUI_CLIENT_BRAND]() {
		return true;
	}

	constructor(options: HaneulGrpcClientOptions) {
		super({ network: options.network });
		const transport =
			options.transport ??
			new GrpcWebFetchTransport({ baseUrl: options.baseUrl, fetchInit: options.fetchInit });
		this.transactionExecutionService = new TransactionExecutionServiceClient(transport);
		this.ledgerService = new LedgerServiceClient(transport);
		this.stateService = new StateServiceClient(transport);
		this.subscriptionService = new SubscriptionServiceClient(transport);
		this.movePackageService = new MovePackageServiceClient(transport);
		this.signatureVerificationService = new SignatureVerificationServiceClient(transport);
		this.nameService = new NameServiceClient(transport);

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

	getTransaction<Include extends HaneulClientTypes.TransactionInclude = {}>(
		input: HaneulClientTypes.GetTransactionOptions<Include>,
	): Promise<HaneulClientTypes.TransactionResult<Include>> {
		return this.core.getTransaction(input);
	}

	executeTransaction<Include extends HaneulClientTypes.TransactionInclude = {}>(
		input: HaneulClientTypes.ExecuteTransactionOptions<Include>,
	): Promise<HaneulClientTypes.TransactionResult<Include>> {
		return this.core.executeTransaction(input);
	}

	signAndExecuteTransaction<Include extends HaneulClientTypes.TransactionInclude = {}>(
		input: HaneulClientTypes.SignAndExecuteTransactionOptions<Include>,
	): Promise<HaneulClientTypes.TransactionResult<Include>> {
		return this.core.signAndExecuteTransaction(input);
	}

	waitForTransaction<Include extends HaneulClientTypes.TransactionInclude = {}>(
		input: HaneulClientTypes.WaitForTransactionOptions<Include>,
	): Promise<HaneulClientTypes.TransactionResult<Include>> {
		return this.core.waitForTransaction(input);
	}

	simulateTransaction<Include extends HaneulClientTypes.SimulateTransactionInclude = {}>(
		input: HaneulClientTypes.SimulateTransactionOptions<Include>,
	): Promise<HaneulClientTypes.SimulateTransactionResult<Include>> {
		return this.core.simulateTransaction(input);
	}

	getReferenceGasPrice(): Promise<HaneulClientTypes.GetReferenceGasPriceResponse> {
		return this.core.getReferenceGasPrice();
	}

	listDynamicFields(
		input: HaneulClientTypes.ListDynamicFieldsOptions,
	): Promise<HaneulClientTypes.ListDynamicFieldsResponse> {
		return this.core.listDynamicFields(input);
	}

	getDynamicField(
		input: HaneulClientTypes.GetDynamicFieldOptions,
	): Promise<HaneulClientTypes.GetDynamicFieldResponse> {
		return this.core.getDynamicField(input);
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
}
