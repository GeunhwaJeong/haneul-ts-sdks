// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { createNetworkConfig } from "@haneullabs/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      network: "devnet",
      url: "https://fullnode.devnet.haneul.io:443",
    },
    testnet: {
      network: "testnet",
      url: "https://fullnode.testnet.haneul.io:443",
    },
    mainnet: {
      network: "mainnet",
      url: "https://fullnode.mainnet.haneul.io:443",
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
