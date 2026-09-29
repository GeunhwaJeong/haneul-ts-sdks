# Byeol TypeScript SDK

## Entry points

| Import                         | Contents                                                                                                                                                                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@haneullabs/byeol`          | Byeol spot and margin — pools, orders, balance managers, flash loans, governance, margin managers/pools, TPSL.                                                                                                            |
| `@haneullabs/byeol/account`  | The shared on-chain **account primitive** (`AccountContract`): the canonical `AccountWrapper`, `Auth`, and custody balances that Byeol's core account wrapper and Byeol Predict both build on.                         |
| `@haneullabs/byeol/sessions` | **Time-limited trading sessions** over a canonical Account (`SessionsContract`): grant an ephemeral address bounded authority until a fixed expiry. Covers the session lifecycle and the Byeol Predict wrappers.          |
| `@haneullabs/byeol/predict`  | **Byeol Predict** — binary and range markets: market discovery, quotes, mint/redeem/claim, PLP, typed receipts and a client-side board pricer, with deployed ids for testnet and mainnet. See [PREDICT.md](./PREDICT.md). |

Subpaths are separate module graphs — importing `@haneullabs/byeol/account` does not load any spot
or margin code.

Each subpath also exports the **deployed ids** for its own surface, so a caller never transcribes
them: `getAccountConfig(network)` on `/account`, `getSessionsConfig(network)` on `/sessions`,
`getConfig(network)` on `/predict`. All three read one generated record (`src/deployments/`), so a
redeploy updates every subpath at once and they cannot end up addressing different deployments. Two
networks are recorded, `testnet` (`byeol-predict-testnet`) and `mainnet`
(`byeol-predict-mainnet`); `getDeployment(network)` names the deployment and the byeolv3
commit those ids came from, and an unrecorded network throws rather than returning placeholder ids.
The two deployments settle in different coins that share one Move module path — Circle native USDC
on mainnet, a mintable test coin (displayed as `DUSDC`) on testnet — so take the coin type from
`getConfig(network).quoteCoinType` on `/predict` rather than assuming either.

### `@haneullabs/byeol/account`

An owner has one canonical `AccountWrapper`, a **derived object** of the account registry, so its id
is computable off-chain with no chain read. `AccountContract` takes only the deployed ids of the
`account` package, so each consumer drives it against **its own** deployment:

```ts
import { Transaction } from '@haneullabs/haneul/transactions';
import { AccountContract, getAccountConfig } from '@haneullabs/byeol/account';

// Deployed ids ship with the package — no transcription. 'testnet' | 'mainnet'.
const account = new AccountContract(getAccountConfig('testnet'));

// …or drive a deployment of your own:
const custom = new AccountContract({ accountPackageId: '0x…', accountRegistry: '0x…' });

const wrapperId = account.deriveAccountWrapperId(owner);

// `quoteCoinType` is the deployment's settlement coin — `getConfig(network).quoteCoinType`
// from `/predict` — not a symbol you assume.
const tx = new Transaction();
tx.add(account.depositFunds({ wrapperId, coin, coinType: quoteCoinType }));
```

> `Account` exported from the package root is `@byeol/core::account::Account` (the per-pool
> trading account). The account primitive's `Account` is a different type with an unrelated layout
> and is exported only from the `/account` subpath.
>
> The two surfaces also decode integers differently. `/account` parses `u64`/`u128`/`u256` to
> `bigint`; the root's BCS structs (`Balances`, `Order`, `OrderBylPrice`) yield decimal
> **strings**. Both are raw on-chain units — neither is scaled — so a value crossing between them
> needs a cast, not a conversion.

### `@haneullabs/byeol/sessions`

An Account owner authorizes an ephemeral address to submit a bounded set of transactions on the
Account's behalf until a fixed expiry. The session key never receives a reusable `Auth` — each
wrapper mints app authorization internally and consumes it in the same call — and there is no
withdrawal or arbitrary-mutation entrypoint.

```ts
import { SessionsContract, getSessionsConfig } from '@haneullabs/byeol/sessions';

// Deployed ids ship with the package — no transcription. 'testnet' | 'mainnet'.
const sessions = new SessionsContract(getSessionsConfig('testnet'));

const wrapperId = sessions.deriveAccountWrapperId(owner);

// Owner-signed: grant an ephemeral key one hour of authority.
tx.add(sessions.authorizeSession({ wrapperId, session: ephemeral, durationMs: 3_600_000 }));

// Signed by the session key: a Predict mint. `pricer` is the result of a preceding
// `expiry_market::load_live_pricer` command in the same transaction.
tx.add(sessions.mintExactQuantity({ expiryMarketId, wrapperId, protocolConfig, pricer, ... }));
```

Notes that bite in practice:

- A grant is dead **at** its expiry — the chain asserts `now < expiresAtMs`.
- Expired grants are never pruned and keep occupying slots, and an Account holds at most **20**
  distinct addresses. Use `SessionsContract.decodeSessions` with `activeSessions` /
  `expiredSessions` to list and prune before granting. There is no bulk on-chain read, and the data
  hangs off the **derived account address**, not the wrapper address.
- `revokeSession` on an address that holds no grant is a silent no-op — no abort, no event.
- Revocation and expiry reads are deliberately **not** version-gated, so they keep working even
  after the sessions package is retired.
- The session address is the transaction sender, so it pays its own gas.
- An admin must have authorized `SessionsApp` on the account registry. Until then — or after a
  `deauthorize_app` — the **trading** wrappers abort with `EAppNotAuthorized`; `authorizeSession`,
  `revokeSession` and `sessionExpirationMs` use owner auth or no auth and keep working.
  `deauthorize_app` does not clear `SessionsData`, so re-authorizing makes every still-unexpired
  grant live again at once — it pauses sessions, it does not kill them.
- Listing grants goes through `deriveSessionsFieldId(owner)` → fetch → `decodeSessions`. Pass the
  whole field object's contents, not the inner value. Fetch it through the core API, and ask for
  content explicitly — JSON-RPC is gone from public fullnodes, and without `include` the response
  carries no bytes:

  ```ts
  const { object } = await client.core.getObject({ objectId, include: { content: true } });
  const grants = SessionsContract.decodeSessions(object.content);
  ```

- The field does not exist until the owner's **first** `authorizeSession` — the Move attaches it
  lazily — so the fetch returns not-found for an owner who has never granted. That is distinct from
  a field that exists holding an empty map, which means every grant was revoked. Treat not-found as
  "no grants", but only not-found: a transport failure must not be collapsed into the same answer.

**What a session key can do.** It cannot withdraw to an address, cannot grant or revoke sessions,
and cannot outlive its expiry. It _can_ trade the Account's full balance: the spot wrappers take a
caller-chosen `Pool` and pull the account's entire Base, Quote and BYL balance into the embedded
manager for the call, with `price_limit` supplied by the caller. Nothing caps notional or restricts
which pools are reachable, so value can leave through adverse pricing. Fund an ephemeral-session
Account with only what you would accept losing to that key.

The Byeol **spot** session wrappers are generated and reachable from `sessionsMoveCalls`, but
they are not wrapped on `SessionsContract`: the surrounding spot-over-Account workflow — finding the
embedded balance manager, reading resting orders and locked balances — is not modelled yet.
