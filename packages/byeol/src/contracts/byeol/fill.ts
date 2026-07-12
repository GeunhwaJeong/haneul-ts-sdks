/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/

/** `Fill` struct represents the results of a match between two orders. */

import { MoveStruct, normalizeMoveArguments } from '../utils/index.js';
import { bcs } from '@haneullabs/haneul/bcs';
import { type Transaction, type TransactionArgument } from '@haneullabs/haneul/transactions';
import * as byl_price from './byl_price.js';
const $moduleName = '@byeol/core::fill';
export const Fill = new MoveStruct({
	name: `${$moduleName}::Fill`,
	fields: {
		maker_order_id: bcs.u128(),
		maker_client_order_id: bcs.u64(),
		execution_price: bcs.u64(),
		balance_manager_id: bcs.Address,
		expired: bcs.bool(),
		completed: bcs.bool(),
		original_maker_quantity: bcs.u64(),
		base_quantity: bcs.u64(),
		quote_quantity: bcs.u64(),
		taker_is_bid: bcs.bool(),
		maker_epoch: bcs.u64(),
		maker_byl_price: byl_price.OrderBylPrice,
		taker_fee: bcs.u64(),
		taker_fee_is_byl: bcs.bool(),
		maker_fee: bcs.u64(),
		maker_fee_is_byl: bcs.bool(),
	},
});
export interface MakerOrderIdArguments {
	self: TransactionArgument;
}
export interface MakerOrderIdOptions {
	package?: string;
	arguments: MakerOrderIdArguments | [self: TransactionArgument];
}
export function makerOrderId(options: MakerOrderIdOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'fill',
			function: 'maker_order_id',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface MakerClientOrderIdArguments {
	self: TransactionArgument;
}
export interface MakerClientOrderIdOptions {
	package?: string;
	arguments: MakerClientOrderIdArguments | [self: TransactionArgument];
}
export function makerClientOrderId(options: MakerClientOrderIdOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'fill',
			function: 'maker_client_order_id',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface ExecutionPriceArguments {
	self: TransactionArgument;
}
export interface ExecutionPriceOptions {
	package?: string;
	arguments: ExecutionPriceArguments | [self: TransactionArgument];
}
export function executionPrice(options: ExecutionPriceOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'fill',
			function: 'execution_price',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
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
			module: 'fill',
			function: 'balance_manager_id',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface ExpiredArguments {
	self: TransactionArgument;
}
export interface ExpiredOptions {
	package?: string;
	arguments: ExpiredArguments | [self: TransactionArgument];
}
export function expired(options: ExpiredOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'fill',
			function: 'expired',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface CompletedArguments {
	self: TransactionArgument;
}
export interface CompletedOptions {
	package?: string;
	arguments: CompletedArguments | [self: TransactionArgument];
}
export function completed(options: CompletedOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'fill',
			function: 'completed',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface OriginalMakerQuantityArguments {
	self: TransactionArgument;
}
export interface OriginalMakerQuantityOptions {
	package?: string;
	arguments: OriginalMakerQuantityArguments | [self: TransactionArgument];
}
export function originalMakerQuantity(options: OriginalMakerQuantityOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'fill',
			function: 'original_maker_quantity',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface BaseQuantityArguments {
	self: TransactionArgument;
}
export interface BaseQuantityOptions {
	package?: string;
	arguments: BaseQuantityArguments | [self: TransactionArgument];
}
export function baseQuantity(options: BaseQuantityOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'fill',
			function: 'base_quantity',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface TakerIsBidArguments {
	self: TransactionArgument;
}
export interface TakerIsBidOptions {
	package?: string;
	arguments: TakerIsBidArguments | [self: TransactionArgument];
}
export function takerIsBid(options: TakerIsBidOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'fill',
			function: 'taker_is_bid',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface QuoteQuantityArguments {
	self: TransactionArgument;
}
export interface QuoteQuantityOptions {
	package?: string;
	arguments: QuoteQuantityArguments | [self: TransactionArgument];
}
export function quoteQuantity(options: QuoteQuantityOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'fill',
			function: 'quote_quantity',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface MakerEpochArguments {
	self: TransactionArgument;
}
export interface MakerEpochOptions {
	package?: string;
	arguments: MakerEpochArguments | [self: TransactionArgument];
}
export function makerEpoch(options: MakerEpochOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'fill',
			function: 'maker_epoch',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface MakerBylPriceArguments {
	self: TransactionArgument;
}
export interface MakerBylPriceOptions {
	package?: string;
	arguments: MakerBylPriceArguments | [self: TransactionArgument];
}
export function makerBylPrice(options: MakerBylPriceOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'fill',
			function: 'maker_byl_price',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface TakerFeeArguments {
	self: TransactionArgument;
}
export interface TakerFeeOptions {
	package?: string;
	arguments: TakerFeeArguments | [self: TransactionArgument];
}
export function takerFee(options: TakerFeeOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'fill',
			function: 'taker_fee',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface TakerFeeIsBylArguments {
	self: TransactionArgument;
}
export interface TakerFeeIsBylOptions {
	package?: string;
	arguments: TakerFeeIsBylArguments | [self: TransactionArgument];
}
export function takerFeeIsDeep(options: TakerFeeIsBylOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'fill',
			function: 'taker_fee_is_byl',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface MakerFeeArguments {
	self: TransactionArgument;
}
export interface MakerFeeOptions {
	package?: string;
	arguments: MakerFeeArguments | [self: TransactionArgument];
}
export function makerFee(options: MakerFeeOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'fill',
			function: 'maker_fee',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface MakerFeeIsBylArguments {
	self: TransactionArgument;
}
export interface MakerFeeIsBylOptions {
	package?: string;
	arguments: MakerFeeIsBylArguments | [self: TransactionArgument];
}
export function makerFeeIsDeep(options: MakerFeeIsBylOptions) {
	const packageAddress = options.package ?? '@byeol/core';
	const argumentsTypes = [null] satisfies (string | null)[];
	const parameterNames = ['self'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'fill',
			function: 'maker_fee_is_byl',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
