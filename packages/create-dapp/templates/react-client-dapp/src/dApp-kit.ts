import { createDAppKit } from "@haneullabs/dapp-kit-react";
import { HaneulGrpcClient } from "@haneullabs/haneul/grpc";

const GRPC_URLS = {
  mainnet: "https://fullnode.mainnet.haneul.io:443",
  testnet: "https://fullnode.testnet.haneul.io:443",
  devnet: "https://fullnode.devnet.haneul.io:443",
};

export const dAppKit = createDAppKit({
  enableBurnerWallet: import.meta.env.DEV,
  networks: ["mainnet", "testnet", "devnet"],
  defaultNetwork: "testnet",
  createClient(network) {
    return new HaneulGrpcClient({ network, baseUrl: GRPC_URLS[network] });
  },
});

// global type registration necessary for the hooks to work correctly
declare module "@haneullabs/dapp-kit-react" {
  interface Register {
    dAppKit: typeof dAppKit;
  }
}
