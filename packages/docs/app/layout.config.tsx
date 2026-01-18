// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
	nav: {
		title: 'Mysten Labs SDKs',
	},
	links: [
		{
			text: 'GitHub',
			url: 'https://github.com/GeunhwaJeong/haneul-ts-sdks',
		},
		{
			text: 'Discord',
			url: 'https://discord.com/invit./Haneul',
		},
	],
};
