#!/usr/bin/env node
import { Command } from 'commander';
import prompts from 'prompts';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
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
  // Sempre garantir TypeScript básico para tsc --noEmit (tsconfig gerado)
  dev.add('typescript');
  dev.add('@types/node');
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
    dev.add('postcss');
  }
  if (answers.styling?.includes('tailwind')) {
    dev.add('tailwindcss');
    dev.add('prettier-plugin-tailwindcss');
  }
  return Array.from(dev);
}

function injectScripts(cwd, answers) {
  const pkgPath = join(cwd, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  pkg.scripts ||= {};
  // Base lint/format e type-check
  if (answers.linter === 'biome') {
    pkg.scripts.lint ||= 'biome check .';
    pkg.scripts['lint:fix'] ||= 'biome check --write .';
    pkg.scripts.format ||= 'biome format --write .';
    pkg.scripts['format:check'] ||= 'biome format --check .';
  } else {
    pkg.scripts.lint ||= 'eslint .';
    pkg.scripts['lint:fix'] ||= 'eslint . --fix';
    pkg.scripts.format ||= 'prettier --write .';
    pkg.scripts['format:check'] ||= 'prettier --check .';
  }
  pkg.scripts['type-check'] ||= 'tsc --noEmit';

  // Unit
  if (answers.unit?.includes('vitest')) {
    pkg.scripts.test ||= 'vitest run';
    pkg.scripts['test:watch'] ||= 'vitest';
    pkg.scripts.coverage ||= 'vitest run --coverage';
  }
  if (answers.unit?.includes('jest')) {
    pkg.scripts.test ||= 'jest';
    pkg.scripts['test:watch'] ||= 'jest --watch';
  }
  // E2E
  if (answers.e2e?.includes('playwright')) {
    pkg.scripts['test:e2e'] ||= 'playwright test';
    pkg.scripts['test:e2e:playwright'] ||= 'playwright test';
  }
  if (answers.e2e?.includes('cypress')) {
    // Se já existir test:e2e (por Playwright), adiciona scripts específicos
    if (!pkg.scripts['test:e2e']) pkg.scripts['test:e2e'] = 'cypress run';
    pkg.scripts['test:e2e:cypress'] ||= 'cypress run';
    pkg.scripts['test:e2e:cypress:open'] ||= 'cypress open';
  }
  // QA agregador (mantém simples e rápido)
  pkg.scripts.qa ||= 'npm run lint && npm run type-check && npm run test';
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log('Scripts adicionados ao package.json');
}

function buildEslintConfigContent(answers) {
  if (answers.linter === 'biome') {
    return null;
  }
  const imports = ["import base from 'code-kit/eslint/base.js';"];
  const spreads = ['...base'];
  if (answers.projectType === 'react') {
    imports.push("import react from 'code-kit/eslint/react.js';");
    spreads.push('...react');
  }
  if (answers.projectType === 'next') {
    imports.push("import next from 'code-kit/eslint/next.js';");
    spreads.push('...next');
  }
  if (answers.styling?.includes('tailwind')) {
    imports.push("import tailwind from 'code-kit/eslint/tailwind.js';");
    spreads.push('...tailwind');
  }
  return `${imports.join('\n')}\n\nexport default [\n\t${spreads.join(',\n\t')}\n];\n`;
}

function writeESLintConfig(cwd, answers) {
  const content = buildEslintConfigContent(answers);
  if (!content) return;
  writeFileSync(join(cwd, 'eslint.config.js'), content);
  console.log('Gerado: eslint.config.js');
}

function writePrettierConfig(cwd) {
  const content = "import base from 'code-kit/prettier/base.js';\nexport default base;\n";
  writeFileSync(join(cwd, 'prettier.config.js'), content);
  console.log('Gerado: prettier.config.js');
}

function writeTSConfig(cwd) {
  const content = JSON.stringify({
    extends: 'code-kit/typescript/base',
    compilerOptions: { emitDeclarationOnly: false },
  }, null, 2) + '\n';
  writeFileSync(join(cwd, 'tsconfig.json'), content);
  console.log('Gerado: tsconfig.json');
}

function writeBiomeConfig(cwd) {
  const content = JSON.stringify({ extends: 'code-kit/biome/config' }, null, 2) + '\n';
  writeFileSync(join(cwd, 'biome.json'), content);
  console.log('Gerado: biome.json');
}

function writeStylelintConfig(cwd) {
  const content = "import stylelintBase from 'code-kit/stylelint/base.js';\nexport default stylelintBase;\n";
  writeFileSync(join(cwd, 'stylelint.config.js'), content);
  console.log('Gerado: stylelint.config.js');
}

async function askSelections() {
  const questions = [
    {
      type: 'select',
      name: 'linter',
      message: 'Escolha o linter/formattter principal (gera configs automaticamente):',
      hint: 'ESLint + Prettier (Flat config) ou Biome (check/format).',
      choices: [
        { title: 'ESLint + Prettier (recomendado)', value: 'eslint-prettier' },
        { title: 'Biome (alternativa tudo‑em‑um)', value: 'biome' },
      ],
      initial: 0
    },
    {
      type: 'multiselect',
      name: 'unit',
      message: 'Selecione framework(s) de testes unitários:',
      hint: 'Vitest (leve e rápido) ou Jest (ecossistema amplo).',
      choices: [
        { title: 'Vitest (padrão)', value: 'vitest', selected: true },
        { title: 'Jest', value: 'jest' },
      ],
      min: 1
    },
    {
      type: 'multiselect',
      name: 'e2e',
      message: 'Selecione ferramenta(s) de E2E:',
      hint: 'Playwright (multi‑browser) e/ou Cypress.',
      choices: [
        { title: 'Playwright', value: 'playwright', selected: true },
        { title: 'Cypress', value: 'cypress' },
      ]
    },
    {
      type: 'multiselect',
      name: 'styling',
      message: 'Selecione opções de styling:',
      hint: 'Gera configs para Stylelint e integra Tailwind na formatação.',
      choices: [
        { title: 'Stylelint', value: 'stylelint', selected: true },
        { title: 'Tailwind (ordenação via Prettier plugin)', value: 'tailwind' },
      ]
    },
    {
      type: 'select',
      name: 'projectType',
      message: 'Tipo de projeto (ajusta regras do ESLint quando aplicável):',
      choices: [
        { title: 'Node', value: 'node' },
        { title: 'React', value: 'react' },
        { title: 'Next.js', value: 'next' },
      ],
      initial: 0
    },
  ];
  return prompts(questions, { onCancel: () => { console.log('Operação cancelada.'); process.exit(1); } });
}

const program = new Command();
program
  .name('code-kit')
  .description('Utilitário CLI para scaffolding e configuração do code-kit')
  .version('0.1.0');

program
  .command('init')
  .description('Inicializa configuração básica do projeto (instala deps e injeta scripts)')
  .action(async () => {
    const answers = await askSelections();
    console.log('Seleções:', answers);
    const pm = detectPackageManager(process.cwd());
    const devDeps = mapSelectionsToDeps(answers);
    if (devDeps.length) {
      console.log(`Instalando dependências de desenvolvimento (${pm}):`, devDeps.join(', '));
      await installDevDependencies(pm, devDeps);
    }
    injectScripts(process.cwd(), answers);
    // Gerar arquivos de configuração conforme seleções (mesmo comportamento do comando apply)
    if (answers.linter === 'biome') {
      writeBiomeConfig(process.cwd());
    } else {
      writeESLintConfig(process.cwd(), answers);
      writePrettierConfig(process.cwd());
    }
    if (answers.styling?.includes('stylelint')) {
      writeStylelintConfig(process.cwd());
    }
    writeTSConfig(process.cwd());
    console.log('Setup interativo concluído (scripts + arquivos gerados).');
  });

program
  .command('apply')
  .description('Gera arquivos de configuração (ESLint/Prettier/TS/Biome/Stylelint) conforme seleções')
  .action(async () => {
    const answers = await askSelections();
    if (answers.linter === 'biome') {
      writeBiomeConfig(process.cwd());
    } else {
      writeESLintConfig(process.cwd(), answers);
      writePrettierConfig(process.cwd());
    }
    if (answers.styling?.includes('stylelint')) {
      writeStylelintConfig(process.cwd());
    }
    writeTSConfig(process.cwd());
    console.log('Arquivos gerados com sucesso.');
  });

program.parseAsync(process.argv);
