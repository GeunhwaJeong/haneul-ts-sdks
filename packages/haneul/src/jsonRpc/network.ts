// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/**
 * @deprecated JSON-RPC APIs are deprecated in the Haneul TypeScript SDK. Use `HaneulGrpcClient`
 * from `@haneullabs/haneul/grpc` or `HaneulGraphQLClient` from `@haneullabs/haneul/graphql` instead.
 */
export function getJsonRpcFullnodeUrl(network: 'mainnet' | 'testnet' | 'devnet' | 'localnet') {
	switch (network) {
		case 'mainnet':
			return 'http://158.69.54.239:9000';
		case 'testnet':
			return 'https://fullnode.testnet.haneul.io:443';
		case 'devnet':
			return 'https://fullnode.devnet.haneul.io:443';
		case 'localnet':
			return 'http://127.0.0.1:9000';
		default:
			throw new Error(`Unknown network: ${network}`);
	}
}
