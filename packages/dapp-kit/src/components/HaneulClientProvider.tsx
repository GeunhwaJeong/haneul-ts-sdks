// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { getJsonRpcFullnodeUrl, isSuiJsonRpcClient, HaneulJsonRpcClient } from '@haneullabs/haneul/jsonRpc';
import type { HaneulJsonRpcClientOptions } from '@haneullabs/haneul/jsonRpc';
import { createContext, useMemo, useState } from 'react';

import type { NetworkConfig } from '../hooks/networkConfig.js';

type NetworkConfigs<T extends NetworkConfig | HaneulJsonRpcClient = NetworkConfig | HaneulJsonRpcClient> =
	Record<string, T>;

export interface HaneulClientProviderContext {
	client: HaneulJsonRpcClient;
	networks: NetworkConfigs;
	network: string;
	config: NetworkConfig | null;
	selectNetwork: (network: string) => void;
}

export const HaneulClientContext = createContext<HaneulClientProviderContext | null>(null);

export type HaneulClientProviderProps<T extends NetworkConfigs> = {
	createClient?: (name: keyof T, config: T[keyof T]) => HaneulJsonRpcClient;
	children: React.ReactNode;
	networks?: T;
	onNetworkChange?: (network: keyof T & string) => void;
} & (
	| {
			defaultNetwork?: keyof T & string;
			network?: never;
	  }
	| {
			defaultNetwork?: never;
			network?: keyof T & string;
	  }
);

const DEFAULT_NETWORKS = {
	localnet: { url: getJsonRpcFullnodeUrl('localnet') },
};

const DEFAULT_CREATE_CLIENT = function createClient(
	_name: string,
	config: NetworkConfig | HaneulJsonRpcClient,
) {
	if (isSuiJsonRpcClient(config)) {
		return config;
	}

	return new HaneulJsonRpcClient(config);
};

export function HaneulClientProvider<T extends NetworkConfigs>(props: HaneulClientProviderProps<T>) {
	const { onNetworkChange, network, children } = props;
	const networks = (props.networks ?? DEFAULT_NETWORKS) as T;
	const createClient =
		(props.createClient as typeof DEFAULT_CREATE_CLIENT) ?? DEFAULT_CREATE_CLIENT;

	const [selectedNetwork, setSelectedNetwork] = useState<keyof T & string>(
		props.network ?? props.defaultNetwork ?? (Object.keys(networks)[0] as keyof T & string),
	);

	const currentNetwork = props.network ?? selectedNetwork;

	const client = useMemo(() => {
		return createClient(currentNetwork, networks[currentNetwork]);
	}, [createClient, currentNetwork, networks]);

	const ctx = useMemo((): HaneulClientProviderContext => {
		return {
			client,
			networks,
			network: currentNetwork,
			config:
				networks[currentNetwork] instanceof HaneulJsonRpcClient
					? null
					: (networks[currentNetwork] as HaneulJsonRpcClientOptions),
			selectNetwork: (newNetwork) => {
				if (currentNetwork === newNetwork) {
					return;
				}

				if (!network && newNetwork !== selectedNetwork) {
					setSelectedNetwork(newNetwork);
				}

				onNetworkChange?.(newNetwork);
			},
		};
	}, [client, networks, selectedNetwork, currentNetwork, network, onNetworkChange]);

	return <HaneulClientContext.Provider value={ctx}>{children}</HaneulClientContext.Provider>;
}
