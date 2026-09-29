/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/

/**
 * Defines the root capability used by state-owning modules to authorize Predict
 * governance operations. Possession is the sole authority; the package exposes no
 * on-chain revocation or rotation mechanism for this capability.
 */

import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@haneullabs/haneul/bcs';
import { type Transaction } from '@haneullabs/haneul/transactions';
const $moduleName = '@local-pkg/byeol_predict::admin';
export const AdminCap = new MoveStruct({
	name: `${$moduleName}::AdminCap`,
	fields: {
		id: bcs.Address,
	},
});
export interface IdArguments {
	cap: RawTransactionArgument<string>;
}
export interface IdOptions {
	package?: string;
	arguments: IdArguments | [cap: RawTransactionArgument<string>];
	config?: {
		predictPackageId?: string;
	};
}
/** Returns the capability identity for administration tooling and object discovery. */
export function id(options: IdOptions) {
	const packageAddress =
		options.package ?? options.config?.predictPackageId ?? '@local-pkg/byeol_predict';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['cap'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'admin',
			function: 'id',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
