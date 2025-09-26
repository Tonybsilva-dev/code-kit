#!/usr/bin/env node
import { Command } from 'commander';
import prompts from 'prompts';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function detectPackageManager(cwd) {
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn';
  if (existsSync(join(cwd, 'package-lock.json'))) return 'npm';
  try {
    const pkg = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf-8'));
    return pkg.packageManager?.split('@')[0] || 'npm';
  } catch {
    return 'npm';
  }
}

function buildInstallArgs(pm, devDeps) {
  if (!devDeps.length) return null;
  switch (pm) {
    case 'pnpm':
      return ['add', '-D', ...devDeps];
    case 'yarn':
      return ['add', '-D', ...devDeps];
    default:
      return ['install', '-D', ...devDeps]; // npm
  }
}

async function installDevDependencies(pm, devDeps) {
  const args = buildInstallArgs(pm, devDeps);
  if (!args) return;
  return new Promise((resolve, reject) => {
    const child = spawn(pm, args, { stdio: 'inherit' });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${pm} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

function mapSelectionsToDeps(answers) {
  const dev = new Set();
  if (answers.linter === 'eslint-prettier') {
    dev.add('eslint');
    dev.add('prettier');
    dev.add('eslint-config-prettier');
    dev.add('@eslint/js');
    dev.add('typescript-eslint');
    dev.add('eslint-plugin-import');
    dev.add('eslint-plugin-promise');
    dev.add('eslint-plugin-n');
  }
  if (answers.linter === 'biome') {
    dev.add('@biomejs/biome');
  }
  if (answers.unit?.includes('vitest')) {
    dev.add('vitest');
    dev.add('@vitest/coverage-v8');
  }
  if (answers.unit?.includes('jest')) {
    dev.add('jest');
  }
  if (answers.e2e?.includes('playwright')) {
    dev.add('@playwright/test');
  }
  if (answers.e2e?.includes('cypress')) {
    dev.add('cypress');
  }
  if (answers.styling?.includes('stylelint')) {
    dev.add('stylelint');
  }
  if (answers.styling?.includes('tailwind')) {
    dev.add('tailwindcss');
  }
  return Array.from(dev);
}

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
        type: 'select', name: 'linter', message: 'Linter:', choices: [
          { title: 'ESLint + Prettier', value: 'eslint-prettier' },
          { title: 'Biome', value: 'biome' },
        ], initial: 0
      },
      {
        type: 'multiselect', name: 'unit', message: 'Testes unitários:', choices: [
          { title: 'Vitest', value: 'vitest', selected: true },
          { title: 'Jest', value: 'jest' },
        ], min: 1
      },
      {
        type: 'multiselect', name: 'e2e', message: 'E2E:', choices: [
          { title: 'Playwright', value: 'playwright', selected: true },
          { title: 'Cypress', value: 'cypress' },
        ]
      },
      {
        type: 'multiselect', name: 'styling', message: 'Styling:', choices: [
          { title: 'Stylelint', value: 'stylelint', selected: true },
          { title: 'Tailwind', value: 'tailwind' },
        ]
      },
      {
        type: 'select', name: 'projectType', message: 'Tipo de projeto:', choices: [
          { title: 'Node', value: 'node' },
          { title: 'React', value: 'react' },
          { title: 'Next.js', value: 'next' },
        ], initial: 0
      },
    ];

    const answers = await prompts(questions, { onCancel: () => { console.log('Operação cancelada.'); process.exit(1); } });
    console.log('Seleções:', answers);

    const pm = detectPackageManager(process.cwd());
    const devDeps = mapSelectionsToDeps(answers);
    if (devDeps.length) {
      console.log(`Instalando dependências de desenvolvimento (${pm}):`, devDeps.join(', '));
      await installDevDependencies(pm, devDeps);
    }

    console.log('Setup interativo concluído.');
  });

program.parseAsync(process.argv);
