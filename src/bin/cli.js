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
		const answers = await prompts([
			{ name: 'usePrettier', type: 'toggle', message: 'Configurar Prettier?', initial: true, active: 'yes', inactive: 'no' },
			{ name: 'useESLint', type: 'toggle', message: 'Configurar ESLint?', initial: true, active: 'yes', inactive: 'no' },
		]);
		console.log('Respostas:', answers);
		console.log('Setup básico concluído.');
	});

program.parseAsync(process.argv);
