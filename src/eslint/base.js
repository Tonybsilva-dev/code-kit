import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import promisePlugin from 'eslint-plugin-promise';
import nPlugin from 'eslint-plugin-n';

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		plugins: {
			import: importPlugin,
			promise: promisePlugin,
			n: nPlugin,
		},
		files: ['**/*.{ts,tsx,js}'],
		languageOptions: {
			globals: {
				console: 'readonly',
				process: 'readonly',
				__dirname: 'readonly',
				module: 'readonly'
			}
		},
		rules: {
			'no-unused-vars': 'warn',
			'no-console': 'error',
			'eqeqeq': ['error', 'always'],
			'import/order': ['error', { 'newlines-between': 'always' }],
			'semi': ['error', 'always']
		}
	}
);
