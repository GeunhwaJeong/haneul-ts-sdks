/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/

/**
 * Defines revocable authority for market creation without granting pool-valuation,
 * oracle-write, or root-admin power. `Registry` owns the allowlist and the
 * creation entrypoint this capability gates.
 */

import { MoveStruct, normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
import { bcs } from '@haneullabs/haneul/bcs';
import { type Transaction } from '@haneullabs/haneul/transactions';
const $moduleName = '@local-pkg/byeol_predict::market_lifecycle_cap';
export const MarketLifecycleCap = new MoveStruct({
	name: `${$moduleName}::MarketLifecycleCap`,
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
/** Returns the capability identity used by the registry allowlist. */
export function id(options: IdOptions) {
	const packageAddress =
		options.package ?? options.config?.predictPackageId ?? '@local-pkg/byeol_predict';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['cap'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'market_lifecycle_cap',
			function: 'id',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface DestroyArguments {
	cap: RawTransactionArgument<string>;
}
export interface DestroyOptions {
	package?: string;
	arguments: DestroyArguments | [cap: RawTransactionArgument<string>];
	config?: {
		predictPackageId?: string;
	};
}
/** Destroy a `MarketLifecycleCap` the holder no longer needs. */
export function destroy(options: DestroyOptions) {
	const packageAddress =
		options.package ?? options.config?.predictPackageId ?? '@local-pkg/byeol_predict';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['cap'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'market_lifecycle_cap',
			function: 'destroy',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
