// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { getJsonRpcFullnodeUrl } from "@haneullabs/haneul/jsonRpc";
import { createNetworkConfig } from "@haneullabs/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      network: "devnet",
      url: getJsonRpcFullnodeUrl("devnet"),
    },
    testnet: {
      network: "testnet",
      url: getJsonRpcFullnodeUrl("testnet"),
    },
    mainnet: {
      network: "mainnet",
      url: getJsonRpcFullnodeUrl("mainnet"),
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
