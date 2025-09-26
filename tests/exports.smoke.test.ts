import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

describe('package exports smoke', () => {
	it('imports eslint base/react/tailwind', async () => {
		const base = await import('code-kit/eslint/base');
		expect(base).toBeTruthy();
		const react = await import('code-kit/eslint/react');
		expect(react).toBeTruthy();
		const tailwind = await import('code-kit/eslint/tailwind');
		expect(tailwind).toBeTruthy();
	});

	it('resolves eslint next subpath without evaluation', () => {
		const resolved = require.resolve('code-kit/eslint/next');
		expect(typeof resolved).toBe('string');
	});

	it('imports prettier base', async () => {
		const prettier = await import('code-kit/prettier/base');
		expect(prettier).toBeTruthy();
	});

	it('imports typescript base', async () => {
		const ts = await import('code-kit/typescript/base');
		expect(ts).toBeTruthy();
	});

	it('imports biome config', async () => {
		const biome = await import('code-kit/biome/config');
		expect(biome).toBeTruthy();
	});

	it('imports stylelint base', async () => {
		const stylelint = await import('code-kit/stylelint/base');
		expect(stylelint).toBeTruthy();
	});
});
