// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, test } from 'vitest';

import { isValidHaneulNSName, normalizeHaneulNSName } from '../../../src/utils';

describe('isValidHaneulNSName', () => {
	test('valid HaneulNS names', () => {
		expect(isValidHaneulNSName('example.sui')).toBe(true);
		expect(isValidHaneulNSName('EXAMPLE.sui')).toBe(true);
		expect(isValidHaneulNSName('@example')).toBe(true);
		expect(isValidHaneulNSName('1.example.sui')).toBe(true);
		expect(isValidHaneulNSName('1@example')).toBe(true);
		expect(isValidHaneulNSName('a.b.c.example.sui')).toBe(true);
		expect(isValidHaneulNSName('A.B.c.123@Example')).toBe(true);
		expect(isValidHaneulNSName('1-a@1-b')).toBe(true);
		expect(isValidHaneulNSName('1-a.1-b.sui')).toBe(true);
		expect(isValidHaneulNSName('-@test')).toBe(false);
		expect(isValidHaneulNSName('-1@test')).toBe(false);
		expect(isValidHaneulNSName('test@-')).toBe(false);
		expect(isValidHaneulNSName('test@-1')).toBe(false);
		expect(isValidHaneulNSName('test@-a')).toBe(false);
		expect(isValidHaneulNSName('test.sui2')).toBe(false);
		expect(isValidHaneulNSName('.sui2')).toBe(false);
		expect(isValidHaneulNSName('test@')).toBe(false);
		expect(isValidHaneulNSName('@@')).toBe(false);
		expect(isValidHaneulNSName('@@test')).toBe(false);
		expect(isValidHaneulNSName('test@test.test')).toBe(false);
		expect(isValidHaneulNSName('@test.test')).toBe(false);
		expect(isValidHaneulNSName('#@test')).toBe(false);
		expect(isValidHaneulNSName('test@#')).toBe(false);
		expect(isValidHaneulNSName('test.#.sui')).toBe(false);
		expect(isValidHaneulNSName('#.sui')).toBe(false);
		expect(isValidHaneulNSName('@.test.sue')).toBe(false);

		expect(isValidHaneulNSName('hello-.sui')).toBe(false);
		expect(isValidHaneulNSName('hello--.sui')).toBe(false);
		expect(isValidHaneulNSName('hello.-sui')).toBe(false);
		expect(isValidHaneulNSName('hello.--sui')).toBe(false);
		expect(isValidHaneulNSName('hello.sui-')).toBe(false);
		expect(isValidHaneulNSName('hello.sui--')).toBe(false);
		expect(isValidHaneulNSName('hello-@sui')).toBe(false);
		expect(isValidHaneulNSName('hello--@sui')).toBe(false);
		expect(isValidHaneulNSName('hello@-sui')).toBe(false);
		expect(isValidHaneulNSName('hello@--sui')).toBe(false);
		expect(isValidHaneulNSName('hello@sui-')).toBe(false);
		expect(isValidHaneulNSName('hello@sui--')).toBe(false);
		expect(isValidHaneulNSName('hello--world@sui')).toBe(false);
	});
});

describe('normalizeHaneulNSName', () => {
	test('normalize HaneulNS names', () => {
		expect(normalizeHaneulNSName('example.sui')).toMatch('@example');
		expect(normalizeHaneulNSName('EXAMPLE.sui')).toMatch('@example');
		expect(normalizeHaneulNSName('@example')).toMatch('@example');
		expect(normalizeHaneulNSName('1.example.sui')).toMatch('1@example');
		expect(normalizeHaneulNSName('1@example')).toMatch('1@example');
		expect(normalizeHaneulNSName('a.b.c.example.sui')).toMatch('a.b.c@example');
		expect(normalizeHaneulNSName('A.B.c.123@Example')).toMatch('a.b.c.123@example');
		expect(normalizeHaneulNSName('1-a@1-b')).toMatch('1-a@1-b');
		expect(normalizeHaneulNSName('1-a.1-b.sui')).toMatch('1-a@1-b');

		expect(normalizeHaneulNSName('example.sui', 'dot')).toMatch('example.sui');
		expect(normalizeHaneulNSName('EXAMPLE.sui', 'dot')).toMatch('example.sui');
		expect(normalizeHaneulNSName('@example', 'dot')).toMatch('example.sui');
		expect(normalizeHaneulNSName('1.example.sui', 'dot')).toMatch('1.example.sui');
		expect(normalizeHaneulNSName('1@example', 'dot')).toMatch('1.example.sui');
		expect(normalizeHaneulNSName('a.b.c.example.sui', 'dot')).toMatch('a.b.c.example.sui');
		expect(normalizeHaneulNSName('A.B.c.123@Example', 'dot')).toMatch('a.b.c.123.example.sui');
		expect(normalizeHaneulNSName('1-a@1-b', 'dot')).toMatch('1-a.1-b.sui');
		expect(normalizeHaneulNSName('1-a.1-b.sui', 'dot')).toMatch('1-a.1-b.sui');

		expect(() => normalizeHaneulNSName('-@test')).toThrowError('Invalid HaneulNS name -@test');
		expect(normalizeHaneulNSName('1-a@1-b')).toMatchInlineSnapshot('"1-a@1-b"');
		expect(normalizeHaneulNSName('1-a.1-b.sui')).toMatchInlineSnapshot('"1-a@1-b"');
		expect(() => normalizeHaneulNSName('-@test')).toThrowError('Invalid HaneulNS name -@test');
		expect(() => normalizeHaneulNSName('-1@test')).toThrowError('Invalid HaneulNS name -1@test');
		expect(() => normalizeHaneulNSName('test@-')).toThrowError('Invalid HaneulNS name test@-');
		expect(() => normalizeHaneulNSName('test@-1')).toThrowError('Invalid HaneulNS name test@-1');
		expect(() => normalizeHaneulNSName('test@-a')).toThrowError('Invalid HaneulNS name test@-a');
		expect(() => normalizeHaneulNSName('test.sui2')).toThrowError('Invalid HaneulNS name test.sui2');
		expect(() => normalizeHaneulNSName('.sui2')).toThrowError('Invalid HaneulNS name .sui2');
		expect(() => normalizeHaneulNSName('test@')).toThrowError('Invalid HaneulNS name test@');
		expect(() => normalizeHaneulNSName('@@')).toThrowError('Invalid HaneulNS name @@');
		expect(() => normalizeHaneulNSName('@@test')).toThrowError('Invalid HaneulNS name @@test');
		expect(() => normalizeHaneulNSName('test@test.test')).toThrowError(
			'Invalid HaneulNS name test@test.test',
		);
		expect(() => normalizeHaneulNSName('@test.test')).toThrowError('Invalid HaneulNS name @test.test');
		expect(() => normalizeHaneulNSName('#@test')).toThrowError('Invalid HaneulNS name #@test');
		expect(() => normalizeHaneulNSName('test@#')).toThrowError('Invalid HaneulNS name test@#');
		expect(() => normalizeHaneulNSName('test.#.sui')).toThrowError('Invalid HaneulNS name test.#.sui');
		expect(() => normalizeHaneulNSName('#.sui')).toThrowError('Invalid HaneulNS name #.sui');
		expect(() => normalizeHaneulNSName('@.test.sue')).toThrowError('Invalid HaneulNS name @.test.sue');
	});
});
