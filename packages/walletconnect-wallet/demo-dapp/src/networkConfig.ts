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
      url: "http://158.69.54.239:9000",
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
