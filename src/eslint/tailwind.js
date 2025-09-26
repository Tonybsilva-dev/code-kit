import base from './base.js';
import tailwind from 'eslint-plugin-tailwindcss';

export default [
	...base,
	{
		plugins: { tailwindcss: tailwind },
		files: ['**/*.{tsx,jsx}'],
		rules: {
			'tailwindcss/classnames-order': 'warn',
		},
		settings: {
			tailwindcss: {
				callees: ['classnames', 'ctl'],
				tags: ['tw', 'TW'],
			},
		},
	},
];
