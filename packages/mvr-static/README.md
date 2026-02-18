# mvr-static

The mvr-static tool is a typescript CLI tool to generate a static file for Move Registry (mvr)
resolution. This can be used to cache all MVR names for performance & security reasons, and used
with the Haneul client's built-in MVR support.

## Usage

### Generate a static file for MVR resolution

You can generate your static file by running the following command:

```bash
pnpm dlx @haneullabs/mvr-static
```

Available options:

- `--directory <directory>`: The directory to run the command in (defaults to `.`)
- `--output <file-name>`: The output's file name (defaults to `mvr.ts`)
- `--depth <depth>`: The depth of recursive search for MVR names (defaults to `10`)
- `--url-mainnet <url>`: The URL to the mainnet MVR (defaults to
  `https://mainnet.mvr.haneul-labs.com`)
- `--url-testnet <url>`: The URL to the testnet MVR (defaults to
  `https://testnet.mvr.haneul-labs.com`)
- `--include <dir_patterns>`: The directory patterns to include in the search (defaults to
  `**/*.{js,ts,jsx,tsx,mjs,cjs}`)
- `--exclude <dir_patterns>`: The directory patterns to exclude in the search (defaults to
  `'node_modules/**', '**/.*'`)
- `--force`: Force overwrite the existing MVR file (useful in CI) (defaults to `false`)

### Use the static file in your project

Once you have your static file, you can use it in your project by importing it and passing it to the
Haneul client initialization. MVR resolution is now built into the core client.

```ts
import { SuiGrpcClient } from '@haneullabs/haneul/grpc';
import { getMvrCache } from './mvr.ts';

// Create a gRPC client with MVR overrides for your network
const client = new SuiGrpcClient({
	network: 'mainnet',
	baseUrl: 'https://fullnode.mainnet.haneul.io:443',
	mvr: {
		overrides: getMvrCache('mainnet'),
	},
});
```

The client will now use your pre-resolved MVR names instead of making API calls, which improves
performance and security.
