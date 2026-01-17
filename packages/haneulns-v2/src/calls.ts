// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import type { BcsType } from '@haneullabs/bcs';
import { calculatePrice } from './contracts/haneulns/config.js';
import type {
	InitRenewalArguments,
	InitRegistrationArguments,
	RegisterArguments,
	RenewArguments,
} from './contracts/haneulns/payment.js';
import { initRegistration, initRenewal, register, renew } from './contracts/haneulns/payment.js';
import type { ApplyCouponArguments } from './contracts/haneulns_coupons/coupon_house.js';
import { applyCoupon } from './contracts/haneulns_coupons/coupon_house.js';
import type { FreeClaimArguments } from './contracts/haneulns_discounts/free_claims.js';
import { freeClaim } from './contracts/haneulns_discounts/free_claims.js';
import type {
	CalculatePriceAfterDiscountArguments,
	HandleBasePaymentArguments,
	HandlePaymentArguments,
} from './contracts/haneulns_payments/payments.js';
import {
	calculatePriceAfterDiscount,
	handleBasePayment,
	handlePayment,
} from './contracts/haneulns_payments/payments.js';
import type { ApplyPercentageDiscountArguments } from './contracts/haneulns_discounts/discounts.js';
import { applyPercentageDiscount } from './contracts/haneulns_discounts/discounts.js';
import type { Transaction, TransactionObjectInput } from '@haneullabs/sui/transactions';

export interface HaneulNsPackageIds {
	haneulns?: string;
	payments?: string;
	coupons?: string;
	discounts?: string;
}

export interface HaneulNsObjectIds {
	haneulns: string;
	discountHouse: string;
}

export interface HaneulNsCallsOptions {
	packageIds?: HaneulNsPackageIds;
	objectIds: HaneulNsObjectIds;
}

export interface RegisterOptions {
	domain: string;
	couponCode?: string;
	freeClaim?: {
		type: string;
		object: TransactionObjectInput;
	};
	percentageDiscount?: {
		type: string;
		object: TransactionObjectInput;
	};
	coinType: string;

	// years?: number;
	// maxAmount?: bigint;
	// priceInfoObjectId?: string;
	// coinConfig?: string;
	// coin?: string;
}

export interface InitRenewalOptions {
	arguments: Omit<InitRenewalArguments, 'haneulns'>;
}

export interface InitRegistrationOptions {
	arguments: Omit<InitRegistrationArguments, 'haneulns'>;
}

export interface HandleBasePaymentOptions {
	arguments: Omit<HandleBasePaymentArguments, 'haneulns'>;
	typeArguments: [string];
}

export interface HandlePaymentOptions {
	arguments: Omit<HandlePaymentArguments, 'haneulns'>;
	typeArguments: [string];
}

export interface FinalizeRegisterOptions {
	arguments: Omit<RegisterArguments, 'haneulns'>;
}

export interface FinalizeRenewOptions {
	arguments: Omit<RenewArguments, 'haneulns'>;
}

export interface CalculatePriceAfterDiscountOptions {
	arguments: Omit<CalculatePriceAfterDiscountArguments, 'haneulns'>;
	typeArguments: [string];
}

export interface ApplyCouponOptions {
	arguments: Omit<ApplyCouponArguments, 'haneulns'>;
}

export interface ApplyFreeClaimOptions {
	arguments: Omit<FreeClaimArguments<BcsType<any>>, 'haneulns' | 'self'>;
	typeArguments: [string];
}

export interface ApplyPercentageDiscountOptions {
	arguments: Omit<ApplyPercentageDiscountArguments<BcsType<any>>, 'haneulns' | 'self' | '_'> & {
		discountNft: ApplyPercentageDiscountArguments<BcsType<any>>['_'];
	};
	typeArguments: [string];
}

export class HaneulNsCalls {
	#packageIds: HaneulNsPackageIds;
	#objectIds: HaneulNsObjectIds;
	constructor(options: HaneulNsCallsOptions) {
		this.#packageIds = options.packageIds ?? {};
		this.#objectIds = options.objectIds;
	}

	register(options: RegisterOptions) {
		if (options.couponCode && (options.freeClaim || options.percentageDiscount)) {
			throw new Error('Cannot apply both coupon and discount NFT');
		}

		if (options.freeClaim && options.percentageDiscount) {
			throw new Error('Cannot apply both free claim and percentage discount');
		}

		return (tx: Transaction) => {
			const paymentIntent = this.initRegistration({
				arguments: {
					domain: options.domain,
				},
			});

			if (options.couponCode) {
				tx.add(
					this.applyCoupon({
						arguments: {
							intent: paymentIntent,
							couponCode: options.couponCode,
						},
					}),
				);
			}
			if (options.freeClaim) {
				tx.add(
					this.applyFreeClaim({
						arguments: {
							intent: paymentIntent,
							object: (tx) => tx.object(options.freeClaim!.object),
						},
						typeArguments: [options.freeClaim.type],
					}),
				);
			}
			if (options.percentageDiscount) {
				tx.add(
					this.applyPercentageDiscount({
						arguments: {
							intent: paymentIntent,
							discountNft: (tx) => tx.object(options.percentageDiscount!.object),
						},
						typeArguments: [options.percentageDiscount.type],
					}),
				);
			}

			this.calculatePriceAfterDiscount({
				arguments: {
					intent: paymentIntent,
				},
				typeArguments: [options.coinType],
			});
			// const receipt = this.generateReceipt({
			// 	paymentIntent,
			// 	priceAfterDiscount,
			// 	coinConfig: params.coinConfig,
			// 	coin: params.coin,
			// 	maxAmount: params.maxAmount,
			// 	priceInfoObjectId: params.priceInfoObjectId,
			// });
			// const nft = this.finalizeRegister(receipt);

			// if (params.years > 1) {
			// 	this.renew({
			// 		nft,
			// 		years: params.years - 1,
			// 		coinConfig: params.coinConfig,
			// 		coin: params.coin,
			// 		couponCode: params.couponCode,
			// 		discountInfo: params.discountInfo,
			// 		maxAmount: params.maxAmount,
			// 		priceInfoObjectId: params.priceInfoObjectId,
			// 	});
			// }

			// return nft as TransactionObjectArgument;
			throw new Error('Not implemented');
		};
	}

	renew() {
		throw new Error('Not implemented');
	}

	initRegistration(options: InitRegistrationOptions) {
		return initRegistration({
			package: this.#packageIds.payments,
			arguments: {
				haneulns: this.#objectIds.haneulns,
				domain: options.arguments.domain,
			},
		});
	}

	initRenewal(options: InitRenewalOptions) {
		return initRenewal({
			package: this.#packageIds.payments,
			arguments: {
				haneulns: this.#objectIds.haneulns,
				nft: options.arguments.nft,
				years: options.arguments.years,
			},
		});
	}

	calculatePrice: typeof calculatePrice = (options) => {
		return calculatePrice({
			package: this.#packageIds.haneulns,
			...options,
		});
	};

	handleBasePayment(options: HandleBasePaymentOptions) {
		return handleBasePayment({
			package: this.#packageIds.payments,
			arguments: {
				haneulns: this.#objectIds.haneulns,
				intent: options.arguments.intent,
				bbbVault: options.arguments.bbbVault,
				payment: options.arguments.payment,
			},
			typeArguments: options.typeArguments,
		});
	}

	handlePayment(options: HandlePaymentOptions) {
		return handlePayment({
			package: this.#packageIds.payments,
			arguments: {
				haneulns: this.#objectIds.haneulns,
				intent: options.arguments.intent,
				bbbVault: options.arguments.bbbVault,
				payment: options.arguments.payment,
				priceInfoObject: options.arguments.priceInfoObject,
				userPriceGuard: options.arguments.userPriceGuard,
			},
			typeArguments: options.typeArguments,
		});
	}

	finalizeRegister(options: FinalizeRegisterOptions) {
		return register({
			package: this.#packageIds.haneulns,
			arguments: {
				receipt: options.arguments.receipt,
				haneulns: this.#objectIds.haneulns,
			},
		});
	}

	finalizeRenew(options: FinalizeRenewOptions) {
		return renew({
			package: this.#packageIds.haneulns,
			arguments: {
				receipt: options.arguments.receipt,
				haneulns: this.#objectIds.haneulns,
				nft: options.arguments.nft,
			},
		});
	}

	calculatePriceAfterDiscount(options: CalculatePriceAfterDiscountOptions) {
		return calculatePriceAfterDiscount({
			package: this.#packageIds.payments,
			arguments: {
				haneulns: this.#objectIds.haneulns,
				intent: options.arguments.intent,
			},
			typeArguments: options.typeArguments,
		});
	}

	generateReceipt() {
		throw new Error('Not implemented');
	}

	applyCoupon(options: ApplyCouponOptions) {
		return applyCoupon({
			package: this.#packageIds.coupons,
			arguments: {
				haneulns: this.#objectIds.haneulns,
				intent: options.arguments.intent,
				couponCode: options.arguments.couponCode,
			},
		});
	}

	applyFreeClaim(options: ApplyFreeClaimOptions) {
		return freeClaim({
			package: this.#packageIds.discounts,
			arguments: {
				self: this.#objectIds.discountHouse,
				haneulns: this.#objectIds.haneulns,
				intent: options.arguments.intent,
				object: options.arguments.object,
			},
			typeArguments: options.typeArguments,
		});
	}

	applyPercentageDiscount(options: ApplyPercentageDiscountOptions) {
		return applyPercentageDiscount({
			package: this.#packageIds.discounts,
			arguments: {
				self: this.#objectIds.discountHouse,
				haneulns: this.#objectIds.haneulns,
				intent: options.arguments.intent,
				_: options.arguments.discountNft,
			},
			typeArguments: options.typeArguments,
		});
	}

	createSubName() {
		throw new Error('Not implemented');
	}

	createLeafSubName() {
		throw new Error('Not implemented');
	}

	removeLeafSubName() {
		throw new Error('Not implemented');
	}

	setTargetAddress() {
		throw new Error('Not implemented');
	}

	setDefault() {
		throw new Error('Not implemented');
	}

	editSetup() {
		throw new Error('Not implemented');
	}

	extendExpiration() {
		throw new Error('Not implemented');
	}

	setUserData() {
		throw new Error('Not implemented');
	}

	burnExpired() {
		throw new Error('Not implemented');
	}

	burnExpiredSubname() {
		throw new Error('Not implemented');
	}

	setSubnameTargetAddress() {
		throw new Error('Not implemented');
	}

	setSubnameDefault() {
		throw new Error('Not implemented');
	}
}
