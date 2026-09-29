// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { createDAppKit } from "@haneullabs/dapp-kit-react";
import { HaneulGrpcClient } from "@haneullabs/haneul/grpc";

const GRPC_URLS = {
  devnet: "https://fullnode.devnet.haneul.io:443",
  testnet: "https://fullnode.testnet.haneul.io:443",
  mainnet: "http://158.69.54.239:9000",
};

export const dAppKit = createDAppKit({
  networks: ["devnet", "testnet", "mainnet"],
  defaultNetwork: "testnet",
  createClient(network) {
    return new HaneulGrpcClient({ network, baseUrl: GRPC_URLS[network] });
  },
});

declare module "@haneullabs/dapp-kit-react" {
  interface Register {
    dAppKit: typeof dAppKit;
  }
}
