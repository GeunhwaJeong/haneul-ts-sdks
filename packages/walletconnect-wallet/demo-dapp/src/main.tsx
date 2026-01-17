// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import React from "react";
import ReactDOM from "react-dom/client";
import "@haneullabs/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";

import { HaneulClientProvider, WalletProvider } from "@haneullabs/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";
import App from "./App.tsx";
import { networkConfig } from "./networkConfig.ts";
import { registerWalletConnectWallet } from "@haneullabs/walletconnect-wallet";
import { HaneulClient, getFullnodeUrl } from "@haneullabs/sui/client";

const queryClient = new QueryClient();

registerWalletConnectWallet({
  projectId: "your_project_id",
  getClient: (chain) =>
    new HaneulClient({ network: chain, url: getFullnodeUrl(chain) }),
  metadata: {
    walletName: "Wallet Connect",
    icon: "https://walletconnect.org/walletconnect-logo.png",
    enabled: true,
    id: "walletconnect",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme appearance="dark">
      <QueryClientProvider client={queryClient}>
        <HaneulClientProvider networks={networkConfig} defaultNetwork="testnet">
          <WalletProvider autoConnect>
            <App />
          </WalletProvider>
        </HaneulClientProvider>
      </QueryClientProvider>
    </Theme>
  </React.StrictMode>,
);
