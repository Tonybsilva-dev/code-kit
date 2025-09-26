import reactConfig from './react.js';
import next from 'eslint-plugin-next';

export default [
  ...reactConfig,
  {
    plugins: { next },
    files: ['**/*.{tsx,jsx}'],
    rules: {
      '@next/next/no-img-element': 'warn',
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
];
