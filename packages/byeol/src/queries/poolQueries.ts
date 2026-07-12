// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { bcs } from '@haneullabs/haneul/bcs';
import { Transaction } from '@haneullabs/haneul/transactions';
import { normalizeHaneulAddress } from '@haneullabs/haneul/utils';

import type {
	CanPlaceLimitOrderParams,
	CanPlaceMarketOrderParams,
	PoolBookParams,
	PoolTradeParams,
	VaultBalances,
} from '../types/index.js';
import { BYL_SCALAR, FLOAT_SCALAR } from '../utils/config.js';
import type { QueryContext } from './context.js';

export class PoolQueries {
	#ctx: QueryContext;

	constructor(ctx: QueryContext) {
		this.#ctx = ctx;
	}

	async whitelisted(poolKey: string): Promise<boolean> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);

		tx.add(this.#ctx.byeol.whitelisted(poolKey));
		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const bytes = res.commandResults![0].returnValues[0].bcs;
		return bcs.Bool.parse(bytes);
	}

	async vaultBalances(poolKey: string): Promise<VaultBalances> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		const pool = this.#ctx.config.getPool(poolKey);
		const baseScalar = this.#ctx.config.getCoin(pool.baseCoin).scalar;
		const quoteScalar = this.#ctx.config.getCoin(pool.quoteCoin).scalar;

		tx.add(this.#ctx.byeol.vaultBalances(poolKey));
		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const baseInVault = Number(bcs.U64.parse(res.commandResults![0].returnValues[0].bcs));
		const quoteInVault = Number(bcs.U64.parse(res.commandResults![0].returnValues[1].bcs));
		const deepInVault = Number(bcs.U64.parse(res.commandResults![0].returnValues[2].bcs));

		return {
			base: Number((baseInVault / baseScalar).toFixed(9)),
			quote: Number((quoteInVault / quoteScalar).toFixed(9)),
			byl: Number((deepInVault / BYL_SCALAR).toFixed(9)),
		};
	}

	async getPoolIdByAssets(baseType: string, quoteType: string): Promise<string> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		tx.add(this.#ctx.byeol.getPoolIdByAssets(baseType, quoteType));

		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		return bcs.Address.parse(res.commandResults![0].returnValues[0].bcs);
	}

	async midPrice(poolKey: string): Promise<number> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		const pool = this.#ctx.config.getPool(poolKey);
		tx.add(this.#ctx.byeol.midPrice(poolKey));

		const baseCoin = this.#ctx.config.getCoin(pool.baseCoin);
		const quoteCoin = this.#ctx.config.getCoin(pool.quoteCoin);

		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const bytes = res.commandResults![0].returnValues[0].bcs;
		const parsed_mid_price = Number(bcs.U64.parse(bytes));
		const adjusted_mid_price =
			(parsed_mid_price * baseCoin.scalar) / quoteCoin.scalar / FLOAT_SCALAR;

		return Number(adjusted_mid_price.toFixed(9));
	}

	async poolTradeParams(poolKey: string): Promise<PoolTradeParams> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);

		tx.add(this.#ctx.byeol.poolTradeParams(poolKey));
		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const takerFee = Number(bcs.U64.parse(res.commandResults![0].returnValues[0].bcs));
		const makerFee = Number(bcs.U64.parse(res.commandResults![0].returnValues[1].bcs));
		const stakeRequired = Number(bcs.U64.parse(res.commandResults![0].returnValues[2].bcs));

		return {
			takerFee: Number(takerFee / FLOAT_SCALAR),
			makerFee: Number(makerFee / FLOAT_SCALAR),
			stakeRequired: Number(stakeRequired / BYL_SCALAR),
		};
	}

	async poolBookParams(poolKey: string): Promise<PoolBookParams> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		const pool = this.#ctx.config.getPool(poolKey);
		const baseScalar = this.#ctx.config.getCoin(pool.baseCoin).scalar;
		const quoteScalar = this.#ctx.config.getCoin(pool.quoteCoin).scalar;

		tx.add(this.#ctx.byeol.poolBookParams(poolKey));
		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const tickSize = Number(bcs.U64.parse(res.commandResults![0].returnValues[0].bcs));
		const lotSize = Number(bcs.U64.parse(res.commandResults![0].returnValues[1].bcs));
		const minSize = Number(bcs.U64.parse(res.commandResults![0].returnValues[2].bcs));

		return {
			tickSize: Number((tickSize * baseScalar) / quoteScalar / FLOAT_SCALAR),
			lotSize: Number(lotSize / baseScalar),
			minSize: Number(minSize / baseScalar),
		};
	}

	async stablePool(poolKey: string): Promise<boolean> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		tx.add(this.#ctx.byeol.stablePool(poolKey));

		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const bytes = res.commandResults![0].returnValues[0].bcs;
		return bcs.bool().parse(bytes);
	}

	async registeredPool(poolKey: string): Promise<boolean> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		tx.add(this.#ctx.byeol.registeredPool(poolKey));

		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const bytes = res.commandResults![0].returnValues[0].bcs;
		return bcs.bool().parse(bytes);
	}

	async poolTradeParamsNext(poolKey: string): Promise<PoolTradeParams> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		tx.add(this.#ctx.byeol.poolTradeParamsNext(poolKey));

		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const takerFee = Number(bcs.U64.parse(res.commandResults![0].returnValues[0].bcs));
		const makerFee = Number(bcs.U64.parse(res.commandResults![0].returnValues[1].bcs));
		const stakeRequired = Number(bcs.U64.parse(res.commandResults![0].returnValues[2].bcs));

		return {
			takerFee: takerFee / FLOAT_SCALAR,
			makerFee: makerFee / FLOAT_SCALAR,
			stakeRequired: stakeRequired / BYL_SCALAR,
		};
	}

	async quorum(poolKey: string): Promise<number> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		tx.add(this.#ctx.byeol.quorum(poolKey));

		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const bytes = res.commandResults![0].returnValues[0].bcs;
		const quorum = Number(bcs.U64.parse(bytes));
		return quorum / BYL_SCALAR;
	}

	async poolId(poolKey: string): Promise<string> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		tx.add(this.#ctx.byeol.poolId(poolKey));

		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const bytes = res.commandResults![0].returnValues[0].bcs;
		return normalizeHaneulAddress(bcs.Address.parse(bytes));
	}

	async canPlaceLimitOrder(params: CanPlaceLimitOrderParams): Promise<boolean> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		tx.add(this.#ctx.byeol.canPlaceLimitOrder(params));

		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const bytes = res.commandResults![0].returnValues[0].bcs;
		return bcs.bool().parse(bytes);
	}

	async canPlaceMarketOrder(params: CanPlaceMarketOrderParams): Promise<boolean> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		tx.add(this.#ctx.byeol.canPlaceMarketOrder(params));

		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const bytes = res.commandResults![0].returnValues[0].bcs;
		return bcs.bool().parse(bytes);
	}

	async checkMarketOrderParams(poolKey: string, quantity: number | bigint): Promise<boolean> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		tx.add(this.#ctx.byeol.checkMarketOrderParams(poolKey, quantity));

		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const bytes = res.commandResults![0].returnValues[0].bcs;
		return bcs.bool().parse(bytes);
	}

	async checkLimitOrderParams(
		poolKey: string,
		price: number | bigint,
		quantity: number | bigint,
		expireTimestamp: number,
	): Promise<boolean> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		tx.add(this.#ctx.byeol.checkLimitOrderParams(poolKey, price, quantity, expireTimestamp));

		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const bytes = res.commandResults![0].returnValues[0].bcs;
		return bcs.bool().parse(bytes);
	}
}
