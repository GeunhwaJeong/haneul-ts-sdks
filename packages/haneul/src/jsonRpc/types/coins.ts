// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/**
 * @deprecated JSON-RPC APIs are deprecated in the Haneul TypeScript SDK. Use `HaneulGrpcClient`
 * from `@haneullabs/haneul/grpc` or `HaneulGraphQLClient` from `@haneullabs/haneul/graphql` instead.
 */
export type CoinBalance = {
	coinType: string;
	coinObjectCount: number;
	totalBalance: string;
	lockedBalance: Record<string, string>;
	fundsInAddressBalance?: string;
};
