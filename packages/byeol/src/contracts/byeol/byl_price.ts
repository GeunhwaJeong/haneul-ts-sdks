/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/

/**
 * BYL price module. This module maintains the conversion rate between BYL and
 * the base and quote assets.
 */

import { MoveStruct, normalizeMoveArguments } from '../utils/index.js';
import { bcs } from '@haneullabs/haneul/bcs';
import { type Transaction, type TransactionArgument } from '@haneullabs/haneul/transactions';
const $moduleName = '@byeol/core::byl_price';
export const Price = new MoveStruct({
	name: `${$moduleName}::Price`,
	fields: {
		conversion_rate: bcs.u64(),
		timestamp: bcs.u64(),
	},
});
export const PriceAdded = new MoveStruct({
	name: `${$moduleName}::PriceAdded`,
	fields: {
		conversion_rate: bcs.u64(),
		timestamp: bcs.u64(),
		is_base_conversion: bcs.bool(),
		reference_pool: bcs.Address,
		target_pool: bcs.Address,
	},
});
export const BylPrice = new MoveStruct({
	name: `${$moduleName}::BylPrice`,
	fields: {
		base_prices: bcs.vector(Price),
		cumulative_base: bcs.u64(),
		quote_prices: bcs.vector(Price),
		cumulative_quote: bcs.u64(),
	},
});
export const OrderBylPrice = new MoveStruct({
	name: `${$moduleName}::OrderBylPrice`,
	fields: {
		asset_is_base: bcs.bool(),
		byl_per_asset: bcs.u64(),
	},
});
export interface AssetIsBaseArguments {
	self: TransactionArgument;
}
export interface AssetIsBaseOptions {
	package?: string;
	arguments: AssetIsBaseArguments | [self: TransactionArgument];
}
export function assetIsBase(options: AssetIsBaseOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'byl_price',
			function: 'asset_is_base',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface BylPerAssetArguments {
	self: TransactionArgument;
}
export interface BylPerAssetOptions {
	package?: string;
	arguments: BylPerAssetArguments | [self: TransactionArgument];
}
export function deepPerAsset(options: BylPerAssetOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'byl_price',
			function: 'byl_per_asset',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
