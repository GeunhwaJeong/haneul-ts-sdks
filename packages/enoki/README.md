# `@haneullabs/enoki`

zkLogin authentication and sponsored transactions. Enable users to sign in with Google, Twitch,
Facebook, and other OAuth providers, and execute transactions without gas fees.

## Features

- **zkLogin**: Authenticate users with OAuth providers (Google, Twitch, Facebook)
- **Sponsored Transactions**: Execute transactions without requiring users to hold gas
- **Wallet Integration**: Register Enoki wallets with dApp Kit
- **Subname Management**: Create and manage HaneulNS subnames

## Installation

```sh
npm install @haneullabs/enoki
```

## Quick Start

### Register Enoki wallets

```ts
import { registerEnokiWallets } from '@haneullabs/enoki';

registerEnokiWallets({
	apiKey: 'your-enoki-api-key',
	providers: ['google', 'twitch', 'facebook'],
});
```

### Use with React and dApp Kit

```tsx
import { registerEnokiWallets } from '@haneullabs/enoki';
import { useEnokiFlow } from '@haneullabs/enoki/react';

// In your app setup
registerEnokiWallets({
	apiKey: 'your-enoki-api-key',
	providers: ['google'],
});

// In your component
function LoginButton() {
	const { login } = useEnokiFlow();

	return <button onClick={() => login('google')}>Sign in with Google</button>;
}
```

### Low-level client usage

```ts
import { EnokiClient } from '@haneullabs/enoki';

const client = new EnokiClient({
	apiKey: 'your-enoki-api-key',
});

// Create a sponsored transaction
const sponsored = await client.createSponsoredTransaction({
	network: 'mainnet',
	sender: '0x...',
	transactionKindBytes: '...',
});

// Execute it
await client.executeSponsoredTransaction({
	digest: sponsored.digest,
	signature: '...',
});
```

## Documentation

See the [Enoki documentation](https://docs.enoki.haneul-labs.com) for detailed setup and usage.
