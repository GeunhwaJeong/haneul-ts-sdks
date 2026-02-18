// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { TadaDocumentNode } from 'gql.tada';
import type { DocumentNode } from 'graphql';
import { print } from 'graphql';
import { BaseClient } from '../client/index.js';
import type { HaneulClientTypes } from '../client/index.js';
import { GraphQLCoreClient } from './core.js';
import type { TypedDocumentString } from './generated/queries.js';
import type { TransactionPlugin } from '../transactions/index.js';

export type GraphQLDocument<
	Result = Record<string, unknown>,
	Variables = Record<string, unknown>,
> =
	| string
	| DocumentNode
	| TypedDocumentString<Result, Variables>
	| TypedDocumentNode<Result, Variables>
	| TadaDocumentNode<Result, Variables>;

export type GraphQLQueryOptions<
	Result = Record<string, unknown>,
	Variables = Record<string, unknown>,
> = {
	query: GraphQLDocument<Result, Variables>;
	operationName?: string;
	extensions?: Record<string, unknown>;
	signal?: AbortSignal;
} & (Variables extends { [key: string]: never }
	? { variables?: Variables }
	: {
			variables: Variables;
		});

export type GraphQLQueryResult<Result = Record<string, unknown>> = {
	data?: Result;
	errors?: GraphQLResponseErrors;
	extensions?: Record<string, unknown>;
};

export type GraphQLResponseErrors = Array<{
	message: string;
	locations?: { line: number; column: number }[];
	path?: (string | number)[];
}>;

export interface HaneulGraphQLClientOptions<Queries extends Record<string, GraphQLDocument>> {
	url: string;
	fetch?: typeof fetch;
	headers?: Record<string, string>;
	queries?: Queries;
	network: HaneulClientTypes.Network;
	mvr?: HaneulClientTypes.MvrOptions;
}

export class HaneulGraphQLRequestError extends Error {}

const SUI_CLIENT_BRAND = Symbol.for('@haneullabs/HaneulGraphQLClient') as never;

export function isSuiGraphQLClient(client: unknown): client is HaneulGraphQLClient {
	return (
		typeof client === 'object' && client !== null && (client as any)[SUI_CLIENT_BRAND] === true
	);
}

export class HaneulGraphQLClient<Queries extends Record<string, GraphQLDocument> = {}>
	extends BaseClient
	implements HaneulClientTypes.TransportMethods
{
	#url: string;
	#queries: Queries;
	#headers: Record<string, string>;
	#fetch: typeof fetch;
	core: GraphQLCoreClient;
	get mvr(): HaneulClientTypes.MvrMethods {
		return this.core.mvr;
	}

	get [SUI_CLIENT_BRAND]() {
		return true;
	}

	constructor({
		url,
		fetch: fetchFn = fetch,
		headers = {},
		queries = {} as Queries,
		network,
		mvr,
	}: HaneulGraphQLClientOptions<Queries>) {
		super({
			network,
		});
		this.#url = url;
		this.#queries = queries;
		this.#headers = headers;
		this.#fetch = (...args) => fetchFn(...args);
		this.core = new GraphQLCoreClient({
			graphqlClient: this,
			mvr,
		});
	}

	async query<Result = Record<string, unknown>, Variables = Record<string, unknown>>(
		options: GraphQLQueryOptions<Result, Variables>,
	): Promise<GraphQLQueryResult<Result>> {
		const res = await this.#fetch(this.#url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...this.#headers,
			},
			body: JSON.stringify({
				query:
					typeof options.query === 'string' || options.query instanceof String
						? String(options.query)
						: print(options.query),
				variables: options.variables,
				extensions: options.extensions,
				operationName: options.operationName,
			}),
			signal: options.signal,
		});

		if (!res.ok) {
			throw new HaneulGraphQLRequestError(`GraphQL request failed: ${res.statusText} (${res.status})`);
		}

		return await res.json();
	}

	async execute<
		const Query extends Extract<keyof Queries, string>,
		Result = Queries[Query] extends GraphQLDocument<infer R, unknown> ? R : Record<string, unknown>,
		Variables = Queries[Query] extends GraphQLDocument<unknown, infer V>
			? V
			: Record<string, unknown>,
	>(
		query: Query,
		options: Omit<GraphQLQueryOptions<Result, Variables>, 'query'>,
	): Promise<GraphQLQueryResult<Result>> {
		return this.query({
			...(options as { variables: Record<string, unknown> }),
			query: this.#queries[query]!,
		}) as Promise<GraphQLQueryResult<Result>>;
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
