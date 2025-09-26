#!/usr/bin/env node
import { Command } from 'commander';
import prompts from 'prompts';

const program = new Command();
program
	.name('code-kit')
	.description('Utilitário CLI para scaffolding e configuração do code-kit')
	.version('0.1.0');

program
	.command('init')
	.description('Inicializa configuração básica do projeto')
	.action(async () => {
		const questions = [
			{
				type: 'select',
				name: 'linter',
				message: 'Linter:',
				choices: [
					{ title: 'ESLint + Prettier', value: 'eslint-prettier' },
					{ title: 'Biome', value: 'biome' },
				],
				initial: 0,
			},
			{
				type: 'multiselect',
				name: 'unit',
				message: 'Testes unitários:',
				choices: [
					{ title: 'Vitest', value: 'vitest', selected: true },
					{ title: 'Jest', value: 'jest' },
				],
				min: 1,
			},
			{
				type: 'multiselect',
				name: 'e2e',
				message: 'E2E:',
				choices: [
					{ title: 'Playwright', value: 'playwright', selected: true },
					{ title: 'Cypress', value: 'cypress' },
				],
			},
			{
				type: 'multiselect',
				name: 'styling',
				message: 'Styling:',
				choices: [
					{ title: 'Stylelint', value: 'stylelint', selected: true },
					{ title: 'Tailwind', value: 'tailwind' },
				],
			},
			{
				type: 'select',
				name: 'projectType',
				message: 'Tipo de projeto:',
				choices: [
					{ title: 'Node', value: 'node' },
					{ title: 'React', value: 'react' },
					{ title: 'Next.js', value: 'next' },
				],
				initial: 0,
			},
		];

		const answers = await prompts(questions, {
			onCancel: () => {
				console.log('Operação cancelada.');
				process.exit(1);
			},
		});

		console.log('Seleções:', answers);
		console.log('Setup interativo concluído.');
	});

program.parseAsync(process.argv);
