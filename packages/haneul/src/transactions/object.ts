// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { Transaction, TransactionObjectInput } from './Transaction.js';
import { Inputs } from './Inputs.js';
import {
	MOVE_STDLIB_ADDRESS,
	HANEUL_CLOCK_OBJECT_ID,
	HANEUL_DENY_LIST_OBJECT_ID,
	HANEUL_RANDOM_OBJECT_ID,
	HANEUL_SYSTEM_STATE_OBJECT_ID,
} from '../utils/index.js';

export function createObjectMethods<T>(makeObject: (value: TransactionObjectInput) => T) {
	function object(value: TransactionObjectInput) {
		return makeObject(value);
	}

	object.system = (options?: { mutable?: boolean }) => {
		const mutable = options?.mutable;

		if (mutable !== undefined) {
			return object(
				Inputs.SharedObjectRef({
					objectId: HANEUL_SYSTEM_STATE_OBJECT_ID,
					initialSharedVersion: 1,
					mutable,
				}),
			);
		}

		return object({
			$kind: 'UnresolvedObject',
			UnresolvedObject: {
				objectId: HANEUL_SYSTEM_STATE_OBJECT_ID,
				initialSharedVersion: 1,
			},
		});
	};
	object.clock = () =>
		object(
			Inputs.SharedObjectRef({
				objectId: HANEUL_CLOCK_OBJECT_ID,
				initialSharedVersion: 1,
				mutable: false,
			}),
		);
	object.random = () =>
		object({
			$kind: 'UnresolvedObject',
			UnresolvedObject: {
				objectId: HANEUL_RANDOM_OBJECT_ID,
				mutable: false,
			},
		});
	object.denyList = (options?: { mutable?: boolean }) => {
		return object({
			$kind: 'UnresolvedObject',
			UnresolvedObject: {
				objectId: HANEUL_DENY_LIST_OBJECT_ID,
				mutable: options?.mutable,
			},
		});
	};
	object.option =
		({ type, value }: { type: string; value: TransactionObjectInput | null }) =>
		(tx: Transaction) =>
			tx.moveCall({
				typeArguments: [type],
				target: `${MOVE_STDLIB_ADDRESS}::option::${value === null ? 'none' : 'some'}`,
				arguments: value === null ? [] : [tx.object(value)],
			});

	return object;
}
