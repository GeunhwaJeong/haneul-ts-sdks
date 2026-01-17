// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/**
 * A `temporary` proxy used to proxy subdomain requests because we can't use
 * references in a PTB.
 *
 * Module has no tests as it's a plain proxy for other function calls. All
 * validation happens on those functions.
 *
 * This package will stop being used when we've implemented references in PTBs.
 */

import type { Transaction } from '@haneullabs/sui/transactions';
import { normalizeMoveArguments } from '../utils/index.js';
import type { RawTransactionArgument } from '../utils/index.js';
export interface NewArguments {
	haneulns: RawTransactionArgument<string>;
	subdomain: RawTransactionArgument<string>;
	subdomainName: RawTransactionArgument<string>;
	expirationTimestampMs: RawTransactionArgument<number | bigint>;
	allowCreation: RawTransactionArgument<boolean>;
	allowTimeExtension: RawTransactionArgument<boolean>;
}
export interface NewOptions {
	package?: string;
	arguments:
		| NewArguments
		| [
				haneulns: RawTransactionArgument<string>,
				subdomain: RawTransactionArgument<string>,
				subdomainName: RawTransactionArgument<string>,
				expirationTimestampMs: RawTransactionArgument<number | bigint>,
				allowCreation: RawTransactionArgument<boolean>,
				allowTimeExtension: RawTransactionArgument<boolean>,
		  ];
}
export function _new(options: NewOptions) {
	const packageAddress = options.package ?? '@haneulns/subdomain-proxy';
	const argumentsTypes = [
		`${packageAddress}::haneulns::HaneulNS`,
		`${packageAddress}::subdomain_registration::SubDomainRegistration`,
		'0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
		'0x0000000000000000000000000000000000000000000000000000000000000001::string::String',
		'u64',
		'bool',
		'bool',
	] satisfies string[];
	const parameterNames = [
		'haneulns',
		'subdomain',
		'subdomainName',
		'expirationTimestampMs',
		'allowCreation',
		'allowTimeExtension',
	];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'subdomain_proxy',
			function: 'new',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface NewLeafArguments {
	haneulns: RawTransactionArgument<string>;
	subdomain: RawTransactionArgument<string>;
	subdomainName: RawTransactionArgument<string>;
	target: RawTransactionArgument<string>;
}
export interface NewLeafOptions {
	package?: string;
	arguments:
		| NewLeafArguments
		| [
				haneulns: RawTransactionArgument<string>,
				subdomain: RawTransactionArgument<string>,
				subdomainName: RawTransactionArgument<string>,
				target: RawTransactionArgument<string>,
		  ];
}
export function newLeaf(options: NewLeafOptions) {
	const packageAddress = options.package ?? '@haneulns/subdomain-proxy';
	const argumentsTypes = [
		`${packageAddress}::haneulns::HaneulNS`,
		`${packageAddress}::subdomain_registration::SubDomainRegistration`,
		'0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
		'0x0000000000000000000000000000000000000000000000000000000000000001::string::String',
		'address',
	] satisfies string[];
	const parameterNames = ['haneulns', 'subdomain', 'subdomainName', 'target'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'subdomain_proxy',
			function: 'new_leaf',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface RemoveLeafArguments {
	haneulns: RawTransactionArgument<string>;
	subdomain: RawTransactionArgument<string>;
	subdomainName: RawTransactionArgument<string>;
}
export interface RemoveLeafOptions {
	package?: string;
	arguments:
		| RemoveLeafArguments
		| [
				haneulns: RawTransactionArgument<string>,
				subdomain: RawTransactionArgument<string>,
				subdomainName: RawTransactionArgument<string>,
		  ];
}
export function removeLeaf(options: RemoveLeafOptions) {
	const packageAddress = options.package ?? '@haneulns/subdomain-proxy';
	const argumentsTypes = [
		`${packageAddress}::haneulns::HaneulNS`,
		`${packageAddress}::subdomain_registration::SubDomainRegistration`,
		'0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
		'0x0000000000000000000000000000000000000000000000000000000000000001::string::String',
	] satisfies string[];
	const parameterNames = ['haneulns', 'subdomain', 'subdomainName'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'subdomain_proxy',
			function: 'remove_leaf',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface AddLeafMetadataArguments {
	haneulns: RawTransactionArgument<string>;
	parent: RawTransactionArgument<string>;
	subdomainName: RawTransactionArgument<string>;
	key: RawTransactionArgument<string>;
	value: RawTransactionArgument<string>;
}
export interface AddLeafMetadataOptions {
	package?: string;
	arguments:
		| AddLeafMetadataArguments
		| [
				haneulns: RawTransactionArgument<string>,
				parent: RawTransactionArgument<string>,
				subdomainName: RawTransactionArgument<string>,
				key: RawTransactionArgument<string>,
				value: RawTransactionArgument<string>,
		  ];
}
export function addLeafMetadata(options: AddLeafMetadataOptions) {
	const packageAddress = options.package ?? '@haneulns/subdomain-proxy';
	const argumentsTypes = [
		`${packageAddress}::haneulns::HaneulNS`,
		`${packageAddress}::subdomain_registration::SubDomainRegistration`,
		'0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
		'0x0000000000000000000000000000000000000000000000000000000000000001::string::String',
		'0x0000000000000000000000000000000000000000000000000000000000000001::string::String',
		'0x0000000000000000000000000000000000000000000000000000000000000001::string::String',
	] satisfies string[];
	const parameterNames = ['haneulns', 'parent', 'subdomainName', 'key', 'value'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'subdomain_proxy',
			function: 'add_leaf_metadata',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface RemoveLeafMetadataArguments {
	haneulns: RawTransactionArgument<string>;
	parent: RawTransactionArgument<string>;
	subdomainName: RawTransactionArgument<string>;
	key: RawTransactionArgument<string>;
}
export interface RemoveLeafMetadataOptions {
	package?: string;
	arguments:
		| RemoveLeafMetadataArguments
		| [
				haneulns: RawTransactionArgument<string>,
				parent: RawTransactionArgument<string>,
				subdomainName: RawTransactionArgument<string>,
				key: RawTransactionArgument<string>,
		  ];
}
export function removeLeafMetadata(options: RemoveLeafMetadataOptions) {
	const packageAddress = options.package ?? '@haneulns/subdomain-proxy';
	const argumentsTypes = [
		`${packageAddress}::haneulns::HaneulNS`,
		`${packageAddress}::subdomain_registration::SubDomainRegistration`,
		'0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
		'0x0000000000000000000000000000000000000000000000000000000000000001::string::String',
		'0x0000000000000000000000000000000000000000000000000000000000000001::string::String',
	] satisfies string[];
	const parameterNames = ['haneulns', 'parent', 'subdomainName', 'key'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'subdomain_proxy',
			function: 'remove_leaf_metadata',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface EditSetupArguments {
	haneulns: RawTransactionArgument<string>;
	parent: RawTransactionArgument<string>;
	subdomainName: RawTransactionArgument<string>;
	allowCreation: RawTransactionArgument<boolean>;
	allowTimeExtension: RawTransactionArgument<boolean>;
}
export interface EditSetupOptions {
	package?: string;
	arguments:
		| EditSetupArguments
		| [
				haneulns: RawTransactionArgument<string>,
				parent: RawTransactionArgument<string>,
				subdomainName: RawTransactionArgument<string>,
				allowCreation: RawTransactionArgument<boolean>,
				allowTimeExtension: RawTransactionArgument<boolean>,
		  ];
}
export function editSetup(options: EditSetupOptions) {
	const packageAddress = options.package ?? '@haneulns/subdomain-proxy';
	const argumentsTypes = [
		`${packageAddress}::haneulns::HaneulNS`,
		`${packageAddress}::subdomain_registration::SubDomainRegistration`,
		'0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
		'0x0000000000000000000000000000000000000000000000000000000000000001::string::String',
		'bool',
		'bool',
	] satisfies string[];
	const parameterNames = [
		'haneulns',
		'parent',
		'subdomainName',
		'allowCreation',
		'allowTimeExtension',
	];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'subdomain_proxy',
			function: 'edit_setup',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface SetTargetAddressArguments {
	haneulns: RawTransactionArgument<string>;
	subdomain: RawTransactionArgument<string>;
	newTarget: RawTransactionArgument<string | null>;
}
export interface SetTargetAddressOptions {
	package?: string;
	arguments:
		| SetTargetAddressArguments
		| [
				haneulns: RawTransactionArgument<string>,
				subdomain: RawTransactionArgument<string>,
				newTarget: RawTransactionArgument<string | null>,
		  ];
}
export function setTargetAddress(options: SetTargetAddressOptions) {
	const packageAddress = options.package ?? '@haneulns/subdomain-proxy';
	const argumentsTypes = [
		`${packageAddress}::haneulns::HaneulNS`,
		`${packageAddress}::subdomain_registration::SubDomainRegistration`,
		'0x0000000000000000000000000000000000000000000000000000000000000001::option::Option<address>',
		'0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
	] satisfies string[];
	const parameterNames = ['haneulns', 'subdomain', 'newTarget'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'subdomain_proxy',
			function: 'set_target_address',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface SetUserDataArguments {
	haneulns: RawTransactionArgument<string>;
	subdomain: RawTransactionArgument<string>;
	key: RawTransactionArgument<string>;
	value: RawTransactionArgument<string>;
}
export interface SetUserDataOptions {
	package?: string;
	arguments:
		| SetUserDataArguments
		| [
				haneulns: RawTransactionArgument<string>,
				subdomain: RawTransactionArgument<string>,
				key: RawTransactionArgument<string>,
				value: RawTransactionArgument<string>,
		  ];
}
export function setUserData(options: SetUserDataOptions) {
	const packageAddress = options.package ?? '@haneulns/subdomain-proxy';
	const argumentsTypes = [
		`${packageAddress}::haneulns::HaneulNS`,
		`${packageAddress}::subdomain_registration::SubDomainRegistration`,
		'0x0000000000000000000000000000000000000000000000000000000000000001::string::String',
		'0x0000000000000000000000000000000000000000000000000000000000000001::string::String',
		'0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
	] satisfies string[];
	const parameterNames = ['haneulns', 'subdomain', 'key', 'value'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'subdomain_proxy',
			function: 'set_user_data',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
export interface UnsetUserDataArguments {
	haneulns: RawTransactionArgument<string>;
	subdomain: RawTransactionArgument<string>;
	key: RawTransactionArgument<string>;
}
export interface UnsetUserDataOptions {
	package?: string;
	arguments:
		| UnsetUserDataArguments
		| [
				haneulns: RawTransactionArgument<string>,
				subdomain: RawTransactionArgument<string>,
				key: RawTransactionArgument<string>,
		  ];
}
export function unsetUserData(options: UnsetUserDataOptions) {
	const packageAddress = options.package ?? '@haneulns/subdomain-proxy';
	const argumentsTypes = [
		`${packageAddress}::haneulns::HaneulNS`,
		`${packageAddress}::subdomain_registration::SubDomainRegistration`,
		'0x0000000000000000000000000000000000000000000000000000000000000001::string::String',
		'0x0000000000000000000000000000000000000000000000000000000000000002::clock::Clock',
	] satisfies string[];
	const parameterNames = ['haneulns', 'subdomain', 'key'];
	return (tx: Transaction) =>
		tx.moveCall({
			package: packageAddress,
			module: 'subdomain_proxy',
			function: 'unset_user_data',
			arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
		});
}
