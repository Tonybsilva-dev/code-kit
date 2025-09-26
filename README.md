# code-kit

Coleção de configurações padronizadas (ESLint, Prettier, TypeScript) e CLI para scaffolding rápido de projetos. ESM por padrão (`"type": "module"`).

## Instalação

```bash
npm i -D code-kit
# ou
pnpm add -D code-kit
# ou
yarn add -D code-kit
```

## ESLint (Flat Config)

Arquivo `eslint.config.js` no projeto consumidor:

```js
import base from 'code-kit/eslint/base.js';
// ou composição para React/Next/Tailwind
// import react from 'code-kit/eslint/react.js';
// import next from 'code-kit/eslint/next.js';
// import tailwind from 'code-kit/eslint/tailwind.js';

export default [
  ...base,
  // ...react,
  // ...next,
  // ...tailwind,
];
```

Notas:

- Semicolons obrigatórios (rule: `semi: ['error', 'always']`).
- Integração com Prettier já alinhada via `eslint-config-prettier`.

## Prettier

Arquivo `prettier.config.js` no projeto consumidor:

```js
import base from 'code-kit/prettier/base.js';
export default base;
```

Padrões:

- `semi: true`
- `singleQuote: true`
- `trailingComma: 'all'`

## TypeScript

No `tsconfig.json` do projeto consumidor (TS moderno, estrito, `moduleResolution: bundler` e alias `@/*`):

```json
{
  "extends": "code-kit/typescript/base",
  "compilerOptions": {
    "emitDeclarationOnly": false
  }
}
```

Observação: se sua versão do TypeScript não resolver `exports` de pacote no `extends`, use o caminho resolvido pelo Node:

```json
{
  "extends": "./node_modules/code-kit/src/typescript/base.json"
}
```

## CLI

Inicialização interativa com seleção de ferramentas e instalação automática de dependências:

```bash
npx code-kit init
```

Fluxo do `init`:

- Linter: ESLint+Prettier ou Biome
- Testes unitários: Vitest e/ou Jest
- E2E: Playwright e/ou Cypress
- Styling: Stylelint e/ou Tailwind CSS
- Tipo de projeto: Node / React / Next.js
- Injeção de scripts no `package.json` (lint, format, test, test:e2e, qa)

### Gerar arquivos de config automaticamente (`apply`)

O comando abaixo gera `eslint.config.js`, `prettier.config.js` e `tsconfig.json` conforme suas seleções, sem instalar dependências:

```bash
npx code-kit apply
```

Exemplos de uso:

- Projeto React com Tailwind:
  - selecione: Linter = ESLint+Prettier, Projeto = React, Styling = Tailwind
  - será gerado um `eslint.config.js` que compõe `base + react + tailwind`, um `prettier.config.js` e `tsconfig.json` base
- Projeto Next.js sem Tailwind:
  - selecione: Linter = ESLint+Prettier, Projeto = Next.js, Styling = (nenhum)
  - será gerado um `eslint.config.js` que compõe `base + next`, além de `prettier.config.js` e `tsconfig.json`

## Scripts sugeridos

- `lint`: ESLint (ou `biome check .` se Biome for escolhido)
- `format`: Prettier (ou `biome format --write .`)
- `test`: Vitest/Jest
- `test:e2e`: Playwright/Cypress
- `qa`: `npm run lint && npm run type-check && npm run test`

## Requisitos

- Node 18+
- Gerenciador: npm, pnpm ou yarn (auto-detectado pelo CLI)

## Licença

MIT
