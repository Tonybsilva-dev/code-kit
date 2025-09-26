import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
	{
		ignores: ['dist', 'node_modules'],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	eslintConfigPrettier,
	{
		files: ['**/*.{ts,tsx,js}'],
		rules: {
			semi: ['error', 'always'],
		},
		languageOptions: {
			globals: {
				console: 'readonly',
				process: 'readonly',
				__dirname: 'readonly',
				module: 'readonly',
			},
		},
	},
);
