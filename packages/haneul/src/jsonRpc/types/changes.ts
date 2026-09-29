// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { HaneulObjectChange } from './generated.js';

/**
 * @deprecated JSON-RPC APIs are deprecated in the Haneul TypeScript SDK. Use `HaneulGrpcClient`
 * from `@haneullabs/haneul/grpc` or `HaneulGraphQLClient` from `@haneullabs/haneul/graphql` instead.
 */
export type HaneulObjectChangePublished = Extract<HaneulObjectChange, { type: 'published' }>;
/**
 * @deprecated JSON-RPC APIs are deprecated in the Haneul TypeScript SDK. Use `HaneulGrpcClient`
 * from `@haneullabs/haneul/grpc` or `HaneulGraphQLClient` from `@haneullabs/haneul/graphql` instead.
 */
export type HaneulObjectChangeTransferred = Extract<HaneulObjectChange, { type: 'transferred' }>;
/**
 * @deprecated JSON-RPC APIs are deprecated in the Haneul TypeScript SDK. Use `HaneulGrpcClient`
 * from `@haneullabs/haneul/grpc` or `HaneulGraphQLClient` from `@haneullabs/haneul/graphql` instead.
 */
export type HaneulObjectChangeMutated = Extract<HaneulObjectChange, { type: 'mutated' }>;
/**
 * @deprecated JSON-RPC APIs are deprecated in the Haneul TypeScript SDK. Use `HaneulGrpcClient`
 * from `@haneullabs/haneul/grpc` or `HaneulGraphQLClient` from `@haneullabs/haneul/graphql` instead.
 */
export type HaneulObjectChangeDeleted = Extract<HaneulObjectChange, { type: 'deleted' }>;
/**
 * @deprecated JSON-RPC APIs are deprecated in the Haneul TypeScript SDK. Use `HaneulGrpcClient`
 * from `@haneullabs/haneul/grpc` or `HaneulGraphQLClient` from `@haneullabs/haneul/graphql` instead.
 */
export type HaneulObjectChangeWrapped = Extract<HaneulObjectChange, { type: 'wrapped' }>;
/**
 * @deprecated JSON-RPC APIs are deprecated in the Haneul TypeScript SDK. Use `HaneulGrpcClient`
 * from `@haneullabs/haneul/grpc` or `HaneulGraphQLClient` from `@haneullabs/haneul/graphql` instead.
 */
export type HaneulObjectChangeCreated = Extract<HaneulObjectChange, { type: 'created' }>;
