// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { bcs } from '@haneullabs/haneul/bcs';
import { Transaction } from '@haneullabs/haneul/transactions';

import { Account, OrderBylPrice } from '../types/bcs.js';
import type { AccountInfo, LockedBalances, PoolBylPrice } from '../types/index.js';
import { BYL_SCALAR, FLOAT_SCALAR } from '../utils/config.js';
import type { QueryContext } from './context.js';

export class AccountQueries {
	#ctx: QueryContext;

	constructor(ctx: QueryContext) {
		this.#ctx = ctx;
	}

	async account(poolKey: string, managerKey: string): Promise<AccountInfo> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		const pool = this.#ctx.config.getPool(poolKey);
		const baseScalar = this.#ctx.config.getCoin(pool.baseCoin).scalar;
		const quoteScalar = this.#ctx.config.getCoin(pool.quoteCoin).scalar;

		tx.add(this.#ctx.byeol.account(poolKey, managerKey));
		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const accountInformation = res.commandResults![0].returnValues[0].bcs;
		const accountInfo = Account.parse(new Uint8Array(accountInformation));

		return {
			epoch: accountInfo.epoch,
			open_orders: accountInfo.open_orders,
			taker_volume: Number(accountInfo.taker_volume) / baseScalar,
			maker_volume: Number(accountInfo.maker_volume) / baseScalar,
			active_stake: Number(accountInfo.active_stake) / BYL_SCALAR,
			inactive_stake: Number(accountInfo.inactive_stake) / BYL_SCALAR,
			created_proposal: accountInfo.created_proposal,
			voted_proposal: accountInfo.voted_proposal,
			unclaimed_rebates: {
				base: Number(accountInfo.unclaimed_rebates.base) / baseScalar,
				quote: Number(accountInfo.unclaimed_rebates.quote) / quoteScalar,
				byl: Number(accountInfo.unclaimed_rebates.byl) / BYL_SCALAR,
			},
			settled_balances: {
				base: Number(accountInfo.settled_balances.base) / baseScalar,
				quote: Number(accountInfo.settled_balances.quote) / quoteScalar,
				byl: Number(accountInfo.settled_balances.byl) / BYL_SCALAR,
			},
			owed_balances: {
				base: Number(accountInfo.owed_balances.base) / baseScalar,
				quote: Number(accountInfo.owed_balances.quote) / quoteScalar,
				byl: Number(accountInfo.owed_balances.byl) / BYL_SCALAR,
			},
		};
	}

	async lockedBalance(poolKey: string, balanceManagerKey: string): Promise<LockedBalances> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		const pool = this.#ctx.config.getPool(poolKey);
		const baseScalar = this.#ctx.config.getCoin(pool.baseCoin).scalar;
		const quoteScalar = this.#ctx.config.getCoin(pool.quoteCoin).scalar;

		tx.add(this.#ctx.byeol.lockedBalance(poolKey, balanceManagerKey));
		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const baseLocked = Number(bcs.U64.parse(res.commandResults![0].returnValues[0].bcs));
		const quoteLocked = Number(bcs.U64.parse(res.commandResults![0].returnValues[1].bcs));
		const deepLocked = Number(bcs.U64.parse(res.commandResults![0].returnValues[2].bcs));

		return {
			base: Number((baseLocked / baseScalar).toFixed(9)),
			quote: Number((quoteLocked / quoteScalar).toFixed(9)),
			byl: Number((deepLocked / BYL_SCALAR).toFixed(9)),
		};
	}

	async getPoolBylPrice(poolKey: string): Promise<PoolBylPrice> {
		const tx = new Transaction();
		tx.setSender(this.#ctx.address);
		const pool = this.#ctx.config.getPool(poolKey);
		tx.add(this.#ctx.byeol.getPoolBylPrice(poolKey));

		const baseCoin = this.#ctx.config.getCoin(pool.baseCoin);
		const quoteCoin = this.#ctx.config.getCoin(pool.quoteCoin);
		const deepCoin = this.#ctx.config.getCoin('BYL');

		const res = await this.#ctx.client.core.simulateTransaction({
			transaction: tx,
			include: { commandResults: true, effects: true },
		});

		const poolBylPriceBytes = res.commandResults![0].returnValues[0].bcs;
		const poolBylPrice = OrderBylPrice.parse(new Uint8Array(poolBylPriceBytes));

		if (poolBylPrice.asset_is_base) {
			return {
				asset_is_base: poolBylPrice.asset_is_base,
				byl_per_base:
					((Number(poolBylPrice.byl_per_asset) / FLOAT_SCALAR) * baseCoin.scalar) /
					deepCoin.scalar,
			};
		} else {
			return {
				asset_is_base: poolBylPrice.asset_is_base,
				byl_per_quote:
					((Number(poolBylPrice.byl_per_asset) / FLOAT_SCALAR) * quoteCoin.scalar) /
					deepCoin.scalar,
			};
		}
	}
}
