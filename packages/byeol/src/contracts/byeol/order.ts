/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/

/**
 * Order module defines the order struct and its methods. All order matching
 * happens in this module.
 */

import { MoveStruct, normalizeMoveArguments } from '../utils/index.js';
import { bcs } from '@haneullabs/haneul/bcs';
import { type Transaction, type TransactionArgument } from '@haneullabs/haneul/transactions';
import * as byl_price from './byl_price.js';
const $moduleName = '@byeol/core::order';
export const Order = new MoveStruct({
	name: `${$moduleName}::Order`,
	fields: {
		balance_manager_id: bcs.Address,
		order_id: bcs.u128(),
		client_order_id: bcs.u64(),
		quantity: bcs.u64(),
		filled_quantity: bcs.u64(),
		fee_is_byl: bcs.bool(),
		order_byl_price: byl_price.OrderBylPrice,
		epoch: bcs.u64(),
		status: bcs.u8(),
		expire_timestamp: bcs.u64(),
	},
});
export const OrderCanceled = new MoveStruct({
	name: `${$moduleName}::OrderCanceled`,
	fields: {
		balance_manager_id: bcs.Address,
		pool_id: bcs.Address,
		order_id: bcs.u128(),
		client_order_id: bcs.u64(),
		trader: bcs.Address,
		price: bcs.u64(),
		is_bid: bcs.bool(),
		original_quantity: bcs.u64(),
		base_asset_quantity_canceled: bcs.u64(),
		timestamp: bcs.u64(),
	},
});
export const OrderModified = new MoveStruct({
	name: `${$moduleName}::OrderModified`,
	fields: {
		balance_manager_id: bcs.Address,
		pool_id: bcs.Address,
		order_id: bcs.u128(),
		client_order_id: bcs.u64(),
		trader: bcs.Address,
		price: bcs.u64(),
		is_bid: bcs.bool(),
		previous_quantity: bcs.u64(),
		filled_quantity: bcs.u64(),
		new_quantity: bcs.u64(),
		timestamp: bcs.u64(),
	},
});
export interface BalanceManagerIdArguments {
	self: TransactionArgument;
}
export interface BalanceManagerIdOptions {
	package?: string;
	arguments: BalanceManagerIdArguments | [self: TransactionArgument];
}
export function balanceManagerId(options: BalanceManagerIdOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'order',
			function: 'balance_manager_id',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface OrderIdArguments {
	self: TransactionArgument;
}
export interface OrderIdOptions {
	package?: string;
	arguments: OrderIdArguments | [self: TransactionArgument];
}
export function orderId(options: OrderIdOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'order',
			function: 'order_id',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface ClientOrderIdArguments {
	self: TransactionArgument;
}
export interface ClientOrderIdOptions {
	package?: string;
	arguments: ClientOrderIdArguments | [self: TransactionArgument];
}
export function clientOrderId(options: ClientOrderIdOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'order',
			function: 'client_order_id',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface QuantityArguments {
	self: TransactionArgument;
}
export interface QuantityOptions {
	package?: string;
	arguments: QuantityArguments | [self: TransactionArgument];
}
export function quantity(options: QuantityOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'order',
			function: 'quantity',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface FilledQuantityArguments {
	self: TransactionArgument;
}
export interface FilledQuantityOptions {
	package?: string;
	arguments: FilledQuantityArguments | [self: TransactionArgument];
}
export function filledQuantity(options: FilledQuantityOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'order',
			function: 'filled_quantity',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface FeeIsBylArguments {
	self: TransactionArgument;
}
export interface FeeIsBylOptions {
	package?: string;
	arguments: FeeIsBylArguments | [self: TransactionArgument];
}
export function feeIsDeep(options: FeeIsBylOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'order',
			function: 'fee_is_byl',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface OrderBylPriceArguments {
	self: TransactionArgument;
}
export interface OrderBylPriceOptions {
	package?: string;
	arguments: OrderBylPriceArguments | [self: TransactionArgument];
}
export function orderBylPrice(options: OrderBylPriceOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'order',
			function: 'order_byl_price',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface EpochArguments {
	self: TransactionArgument;
}
export interface EpochOptions {
	package?: string;
	arguments: EpochArguments | [self: TransactionArgument];
}
export function epoch(options: EpochOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'order',
			function: 'epoch',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface StatusArguments {
	self: TransactionArgument;
}
export interface StatusOptions {
	package?: string;
	arguments: StatusArguments | [self: TransactionArgument];
}
export function status(options: StatusOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'order',
			function: 'status',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface ExpireTimestampArguments {
	self: TransactionArgument;
}
export interface ExpireTimestampOptions {
	package?: string;
	arguments: ExpireTimestampArguments | [self: TransactionArgument];
}
export function expireTimestamp(options: ExpireTimestampOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'order',
			function: 'expire_timestamp',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface PriceArguments {
	self: TransactionArgument;
}
export interface PriceOptions {
	package?: string;
	arguments: PriceArguments | [self: TransactionArgument];
}
export function price(options: PriceOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'order',
			function: 'price',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
