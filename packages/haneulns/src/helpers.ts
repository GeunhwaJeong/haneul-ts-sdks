// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { Transaction } from '@haneullabs/haneul/transactions';
import { normalizeHaneulNSName } from '@haneullabs/haneul/utils';

export function isSubName(name: string): boolean {
	return normalizeHaneulNSName(name, 'dot').split('.').length > 2;
}

/**
 * Checks if a name is a nested subname.
 * A nested subdomain is a subdomain that is a subdomain of another subdomain.
 * @param name The name to check (e.g test.example.sub.haneul)
 */
export function isNestedSubName(name: string): boolean {
	return normalizeHaneulNSName(name, 'dot').split('.').length > 3;
}

/**
 * The years must be between 1 and 5.
 */
export function validateYears(years: number) {
	if (!(years > 0 && years < 6)) throw new Error('Years must be between 1 and 5');
}

export function zeroCoin(tx: Transaction, type: string) {
	return tx.moveCall({
		target: '0x2::coin::zero',
		typeArguments: [type],
	});
}

export function getConfigType(haneulnsPackageV1: string, innerType: string): string {
	return `${haneulnsPackageV1}::haneulns::ConfigKey<${innerType}>`;
}

export function getDomainType(haneulnsPackageV1: string): string {
	return `${haneulnsPackageV1}::domain::Domain`;
}

export function getPricelistConfigType(haneulnsPackageId: string): string {
	return `${haneulnsPackageId}::pricing_config::PricingConfig`;
}

export function getRenewalPricelistConfigType(haneulnsPackageId: string): string {
	return `${haneulnsPackageId}::pricing_config::RenewalConfig`;
}

export function getCoinDiscountConfigType(paymentPackageId: string): string {
	return `${paymentPackageId}::payments::PaymentsConfig`;
}
