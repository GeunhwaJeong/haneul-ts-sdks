// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { bcs } from '@haneullabs/haneul/bcs';
import { Transaction } from '@haneullabs/haneul/transactions';

import type {
	BaseQuantityIn,
	BaseQuantityOut,
	OrderBylRequiredResult,
	QuantityOut,
	QuoteQuantityIn,
	QuoteQuantityOut,
} from '../types/index.js';
import { BYL_SCALAR } from '../utils/config.js';
import type { QueryContext } from './context.js';

export class QuantityQueries {
	#ctx: QueryContext;

	constructor(ctx: QueryContext) {
		this.#ctx = ctx;
	}

	async getQuoteQuantityOut(
		poolKey: string,
		baseQuantity: number | bigint,
	): Promise<QuoteQuantityOut> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		const pool = this.#ctx.config.getPool(poolKey);
		const baseScalar = this.#ctx.config.getCoin(pool.baseCoin).scalar;
		const quoteScalar = this.#ctx.config.getCoin(pool.quoteCoin).scalar;

		tx.add(this.#ctx.byeol.getQuoteQuantityOut(poolKey, baseQuantity));
		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const baseOut = Number(bcs.U64.parse(res.commandResults![0].returnValues[0].bcs));
		const quoteOut = Number(bcs.U64.parse(res.commandResults![0].returnValues[1].bcs));
		const deepRequired = Number(bcs.U64.parse(res.commandResults![0].returnValues[2].bcs));

		return {
			baseQuantity: Number(baseQuantity),
			baseOut: Number((baseOut / baseScalar).toFixed(9)),
			quoteOut: Number((quoteOut / quoteScalar).toFixed(9)),
			deepRequired: Number((deepRequired / BYL_SCALAR).toFixed(9)),
		};
	}

	async getBaseQuantityOut(
		poolKey: string,
		quoteQuantity: number | bigint,
	): Promise<BaseQuantityOut> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		const pool = this.#ctx.config.getPool(poolKey);
		const baseScalar = this.#ctx.config.getCoin(pool.baseCoin).scalar;
		const quoteScalar = this.#ctx.config.getCoin(pool.quoteCoin).scalar;

		tx.add(this.#ctx.byeol.getBaseQuantityOut(poolKey, quoteQuantity));
		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const baseOut = Number(bcs.U64.parse(res.commandResults![0].returnValues[0].bcs));
		const quoteOut = Number(bcs.U64.parse(res.commandResults![0].returnValues[1].bcs));
		const deepRequired = Number(bcs.U64.parse(res.commandResults![0].returnValues[2].bcs));

		return {
			quoteQuantity: Number(quoteQuantity),
			baseOut: Number((baseOut / baseScalar).toFixed(9)),
			quoteOut: Number((quoteOut / quoteScalar).toFixed(9)),
			deepRequired: Number((deepRequired / BYL_SCALAR).toFixed(9)),
		};
	}

	async getQuantityOut(
		poolKey: string,
		baseQuantity: number | bigint,
		quoteQuantity: number | bigint,
	): Promise<QuantityOut> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		const pool = this.#ctx.config.getPool(poolKey);
		const baseScalar = this.#ctx.config.getCoin(pool.baseCoin).scalar;
		const quoteScalar = this.#ctx.config.getCoin(pool.quoteCoin).scalar;

		tx.add(this.#ctx.byeol.getQuantityOut(poolKey, baseQuantity, quoteQuantity));
		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const baseOut = Number(bcs.U64.parse(res.commandResults![0].returnValues[0].bcs));
		const quoteOut = Number(bcs.U64.parse(res.commandResults![0].returnValues[1].bcs));
		const deepRequired = Number(bcs.U64.parse(res.commandResults![0].returnValues[2].bcs));

		return {
			baseQuantity: Number(baseQuantity),
			quoteQuantity: Number(quoteQuantity),
			baseOut: Number((baseOut / baseScalar).toFixed(9)),
			quoteOut: Number((quoteOut / quoteScalar).toFixed(9)),
			deepRequired: Number((deepRequired / BYL_SCALAR).toFixed(9)),
		};
	}

	async getQuoteQuantityOutInputFee(
		poolKey: string,
		baseQuantity: number | bigint,
	): Promise<QuoteQuantityOut> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		const pool = this.#ctx.config.getPool(poolKey);
		const baseScalar = this.#ctx.config.getCoin(pool.baseCoin).scalar;
		const quoteScalar = this.#ctx.config.getCoin(pool.quoteCoin).scalar;

		tx.add(this.#ctx.byeol.getQuoteQuantityOutInputFee(poolKey, baseQuantity));
		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const baseOut = Number(bcs.U64.parse(res.commandResults![0].returnValues[0].bcs));
		const quoteOut = Number(bcs.U64.parse(res.commandResults![0].returnValues[1].bcs));
		const deepRequired = Number(bcs.U64.parse(res.commandResults![0].returnValues[2].bcs));

		return {
			baseQuantity: Number(baseQuantity),
			baseOut: Number((baseOut / baseScalar).toFixed(9)),
			quoteOut: Number((quoteOut / quoteScalar).toFixed(9)),
			deepRequired: Number((deepRequired / BYL_SCALAR).toFixed(9)),
		};
	}

	async getBaseQuantityOutInputFee(
		poolKey: string,
		quoteQuantity: number | bigint,
	): Promise<BaseQuantityOut> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		const pool = this.#ctx.config.getPool(poolKey);
		const baseScalar = this.#ctx.config.getCoin(pool.baseCoin).scalar;
		const quoteScalar = this.#ctx.config.getCoin(pool.quoteCoin).scalar;

		tx.add(this.#ctx.byeol.getBaseQuantityOutInputFee(poolKey, quoteQuantity));
		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const baseOut = Number(bcs.U64.parse(res.commandResults![0].returnValues[0].bcs));
		const quoteOut = Number(bcs.U64.parse(res.commandResults![0].returnValues[1].bcs));
		const deepRequired = Number(bcs.U64.parse(res.commandResults![0].returnValues[2].bcs));

		return {
			quoteQuantity: Number(quoteQuantity),
			baseOut: Number((baseOut / baseScalar).toFixed(9)),
			quoteOut: Number((quoteOut / quoteScalar).toFixed(9)),
			deepRequired: Number((deepRequired / BYL_SCALAR).toFixed(9)),
		};
	}

	async getQuantityOutInputFee(
		poolKey: string,
		baseQuantity: number | bigint,
		quoteQuantity: number | bigint,
	): Promise<QuantityOut> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		const pool = this.#ctx.config.getPool(poolKey);
		const baseScalar = this.#ctx.config.getCoin(pool.baseCoin).scalar;
		const quoteScalar = this.#ctx.config.getCoin(pool.quoteCoin).scalar;

		tx.add(this.#ctx.byeol.getQuantityOutInputFee(poolKey, baseQuantity, quoteQuantity));
		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const baseOut = Number(bcs.U64.parse(res.commandResults![0].returnValues[0].bcs));
		const quoteOut = Number(bcs.U64.parse(res.commandResults![0].returnValues[1].bcs));
		const deepRequired = Number(bcs.U64.parse(res.commandResults![0].returnValues[2].bcs));

		return {
			baseQuantity: Number(baseQuantity),
			quoteQuantity: Number(quoteQuantity),
			baseOut: Number((baseOut / baseScalar).toFixed(9)),
			quoteOut: Number((quoteOut / quoteScalar).toFixed(9)),
			deepRequired: Number((deepRequired / BYL_SCALAR).toFixed(9)),
		};
	}

	async getBaseQuantityIn(
		poolKey: string,
		targetQuoteQuantity: number | bigint,
		payWithDeep: boolean,
	): Promise<BaseQuantityIn> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		const pool = this.#ctx.config.getPool(poolKey);
		const baseScalar = this.#ctx.config.getCoin(pool.baseCoin).scalar;
		const quoteScalar = this.#ctx.config.getCoin(pool.quoteCoin).scalar;

		tx.add(this.#ctx.byeol.getBaseQuantityIn(poolKey, targetQuoteQuantity, payWithDeep));
		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const baseIn = Number(bcs.U64.parse(res.commandResults![0].returnValues[0].bcs));
		const quoteOut = Number(bcs.U64.parse(res.commandResults![0].returnValues[1].bcs));
		const deepRequired = Number(bcs.U64.parse(res.commandResults![0].returnValues[2].bcs));

		return {
			baseIn: Number((baseIn / baseScalar).toFixed(9)),
			quoteOut: Number((quoteOut / quoteScalar).toFixed(9)),
			deepRequired: Number((deepRequired / BYL_SCALAR).toFixed(9)),
		};
	}

	async getQuoteQuantityIn(
		poolKey: string,
		targetBaseQuantity: number | bigint,
		payWithDeep: boolean,
	): Promise<QuoteQuantityIn> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		const pool = this.#ctx.config.getPool(poolKey);
		const baseScalar = this.#ctx.config.getCoin(pool.baseCoin).scalar;
		const quoteScalar = this.#ctx.config.getCoin(pool.quoteCoin).scalar;

		tx.add(this.#ctx.byeol.getQuoteQuantityIn(poolKey, targetBaseQuantity, payWithDeep));
		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const baseOut = Number(bcs.U64.parse(res.commandResults![0].returnValues[0].bcs));
		const quoteIn = Number(bcs.U64.parse(res.commandResults![0].returnValues[1].bcs));
		const deepRequired = Number(bcs.U64.parse(res.commandResults![0].returnValues[2].bcs));

		return {
			baseOut: Number((baseOut / baseScalar).toFixed(9)),
			quoteIn: Number((quoteIn / quoteScalar).toFixed(9)),
			deepRequired: Number((deepRequired / BYL_SCALAR).toFixed(9)),
		};
	}

	async getOrderBylRequired(
		poolKey: string,
		baseQuantity: number | bigint,
		price: number | bigint,
	): Promise<OrderBylRequiredResult> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		tx.add(this.#ctx.byeol.getOrderBylRequired(poolKey, baseQuantity, price));

		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const deepRequiredTaker = Number(bcs.U64.parse(res.commandResults![0].returnValues[0].bcs));
		const deepRequiredMaker = Number(bcs.U64.parse(res.commandResults![0].returnValues[1].bcs));

		return {
			deepRequiredTaker: Number((deepRequiredTaker / BYL_SCALAR).toFixed(9)),
			deepRequiredMaker: Number((deepRequiredMaker / BYL_SCALAR).toFixed(9)),
		};
	}
}
