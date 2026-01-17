// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { bcs } from '@haneullabs/haneul/bcs';
import type { HaneulClient } from '@haneullabs/haneul/client';
import { HaneulGraphQLClient } from '@haneullabs/haneul/graphql';
import { graphql } from '@haneullabs/haneul/graphql/schemas/latest';
import { fromBase64, normalizeHaneulAddress } from '@haneullabs/haneul/utils';

import { ZkSendLink } from './claim.js';
import type { ZkBagContractOptions } from './zk-bag.js';
import { getContractIds } from './zk-bag.js';

const ListCreatedLinksQuery = graphql(`
	query listCreatedLinks($address: HaneulAddress!, $function: String!, $cursor: String) {
		transactions(
			last: 10
			before: $cursor
			filter: { sentAddress: $address, function: $function }
		) {
			pageInfo {
				startCursor
				hasPreviousPage
			}
			nodes {
				effects {
					timestamp
				}
				digest
				transactionBcs
			}
		}
	}
`);

export async function listCreatedLinks({
	address,
	cursor,
	network,
	contract = getContractIds(network),
	fetch: fetchFn,
	...linkOptions
}: {
	address: string;
	contract?: ZkBagContractOptions;
	cursor?: string;
	network?: 'mainnet' | 'testnet';

	// Link options:
	host?: string;
	path?: string;
	claimApi?: string;
	client?: HaneulClient;
	fetch?: typeof fetch;
}) {
	const gqlClient = new HaneulGraphQLClient({
		url:
			network === 'testnet'
				? 'https://graphql.testnet.haneul.io/graphql'
				: 'https://graphql.mainnet.haneul.io/graphql',
		fetch: fetchFn,
	});

	const packageId = normalizeHaneulAddress(contract.packageId);

	const page = await gqlClient.query({
		query: ListCreatedLinksQuery,
		variables: {
			address,
			cursor,
			function: `${packageId}::zk_bag::new`,
		},
	});

	const transactions = page.data?.transactions;

	if (!transactions || page.errors?.length) {
		throw new Error('Failed to load created links');
	}

	const links = (
		await Promise.all(
			transactions.nodes.map(async (node) => {
				if (!node.transactionBcs) {
					return null;
				}

				const kind = bcs.TransactionData.parse(fromBase64(node.transactionBcs)).V1.kind;

				if (!kind?.ProgrammableTransaction) {
					return null;
				}

				const { inputs, commands } = kind.ProgrammableTransaction;

				const fn = commands.find(
					(command) =>
						command.MoveCall?.package === packageId &&
						command.MoveCall.module === 'zk_bag' &&
						command.MoveCall.function === 'new',
				);

				if (!fn?.MoveCall) {
					return null;
				}

				const addressArg = fn.MoveCall.arguments[1];

				if (addressArg.$kind !== 'Input') {
					throw new Error('Invalid address argument');
				}

				const input = inputs[addressArg.Input];

				if (!input.Pure) {
					throw new Error('Expected Address input to be a Pure value');
				}

				const address = bcs.Address.fromBase64(input.Pure.bytes);

				const link = new ZkSendLink({
					network,
					address,
					contract,
					isContractLink: true,
					...linkOptions,
				});

				await link.loadAssets();

				return {
					link,
					claimed: !!link.claimed,
					assets: link.assets!,
					digest: node.digest,
					createdAt: node.effects?.timestamp!,
				};
			}),
		)
	).reverse();

	return {
		cursor: transactions.pageInfo.startCursor,
		hasNextPage: transactions.pageInfo.hasPreviousPage,
		links: links.filter((link): link is NonNullable<typeof link> => link !== null),
	};
}
