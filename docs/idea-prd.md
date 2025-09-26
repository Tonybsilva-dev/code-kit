# 📚 Guia de Implementação — @Tonybsilva-Dev/code-kit

Este documento descreve **como o projeto deverá ser desenvolvido**, reunindo todas as configurações necessárias em um único guia.  
O objetivo é centralizar padrões de qualidade, formatação, linting, tipagem e testes para projetos JavaScript/TypeScript modernos.

---

## 🎯 Objetivo do Projeto

O projeto **deverá ser desenvolvido da seguinte forma**:

1. **Garantir qualidade e consistência de código** em múltiplos projetos.
2. **Fornecer configurações compartilháveis** para ferramentas de linting, formatação, tipagem e testes.
3. **Ser modular** → cada ferramenta terá seu próprio módulo, que poderá ser usado isoladamente ou em conjunto.
4. **Seguir as melhores práticas do ecossistema JavaScript/TypeScript**.
5. **Facilitar a adoção em projetos novos ou existentes**, com exemplos práticos de configuração.
6. **Permitir automação de setup via CLI (`npx codekit init`)**, eliminando configurações manuais.
7. **Instalar automaticamente todas as dependências atualizadas** no momento da inicialização.
8. **Gerar ou extender arquivos de configuração** já existentes no projeto do usuário.

---

## ⚙️ Ferramentas Abrangidas

O projeto **deverá incluir suporte** às seguintes ferramentas:

- **ESLint** → análise estática e boas práticas.
- **Prettier** → formatação consistente.
- **Biome** → alternativa moderna e performática.
- **TypeScript** → configuração base com regras estritas.
- **Stylelint** → padronização de estilos.
- **Vitest** → testes unitários.
- **Playwright** → testes end-to-end (E2E).
- **(Futuro)** Cypress, Jest + Supertest, Commitlint, Husky, monorepos.

---

## 🤖 Automação via CLI

O projeto **deverá incluir** um CLI acessível via:

```bash
npx codekit init
```

Esse comando deverá abrir um fluxo interativo com as seguintes etapas:

1. Seleção de Linters

 ESLint + Prettier (configuração padrão, modular e madura)

 Biome (linter + formatador moderno e rápido)

2. Seleção de Testes Automatizados

 Jest + Supertest (projetos legado / foco em APIs)

 Vitest (projetos modernos / integração com Vite e TS)

3. Seleção de Testes E2E

 Playwright (padrão moderno, browsers oficiais)

 Cypress (alternativa popular, foco em legados)

4. Estilos

 Stylelint Base (CSS/SCSS)

 Stylelint Styled (Styled Components / CSS-in-JS)

 Tailwind CSS (ativar integração automática com ESLint + Prettier)

5. Extensões de Projeto

 Next.js (adiciona regras e configs específicas)

 React Puro

 Node.js / API

# ⚡ Funcionalidade do CLI

O CLI deverá executar automaticamente:

1. Instalação das dependências corretas e mais atualizadas:

```sh
npm install -D eslint prettier @typescript-eslint/parser ...
```

ou com pnpm/yarn, detectando o gerenciador em uso.

2. Extensão ou criação de arquivos de configuração:

eslint.config.js
.prettierrc
tsconfig.json
stylelint.config.js
vitest.config.ts / jest.config.js
playwright.config.ts

3. Atualização do package.json com scripts recomendados:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "check:types": "tsc --noEmit",
    "stylelint": "stylelint '**/*.{css,scss}' --fix",
    "test": "vitest",
    "test:e2e": "playwright test"
  }
}
```

4. Criação de mensagens de feedback amigáveis para o usuário:

✅ Dependências instaladas

✅ Arquivos de configuração criados/atualizados

🚀 Projeto pronto para uso

## 📦 Estrutura de Configurações

O projeto **deverá ser estruturado** em módulos organizados por pasta:

```bash
/eslint
  ├─ base.js
  ├─ react.js
  ├─ next.js
  └─ tailwind.js
/prettier
  └─ base.js
/biome
  └─ config.json
/typescript
  ├─ base.json
  └─ react.json
/stylelint
  ├─ base.js
  └─ styled.js
/tests
  ├─ vitest.config.ts
  ├─ jest.config.js
  └─ playwright.config.ts
```

Cada pasta conterá configurações exportáveis para uso em diferentes projetos
---

## 📦 ESLint

O projeto **deverá utilizar** o formato **Flat Config (`eslint.config.js`)**.  
Serão fornecidos módulos prontos:

- `eslint/base` → núcleo para JS/TS.
- `eslint/react` → estende `base` com suporte ao React.
- `eslint/next` → estende `react` para Next.js.
- `eslint/tailwind` → adiciona regras específicas do Tailwind CSS.

**Plugins obrigatórios**:  
`@typescript-eslint`, `eslint-plugin-import`, `eslint-plugin-promise`, `eslint-plugin-n`, `eslint-plugin-react`, `eslint-plugin-jsx-a11y`, `eslint-plugin-next`, `eslint-plugin-tailwindcss`.

**Regras chave incluídas**:

- `no-unused-vars`
- `no-console` (bloqueado em produção)
- `eqeqeq`
- `import/order`
- `react-hooks/rules-of-hooks`
- `react-hooks/exhaustive-deps`

---

## ✨ Prettier

O projeto **deverá incluir** o módulo `prettier/base`, com as seguintes características:

- Aspas simples.
- Ponto e vírgula obrigatório.
- Vírgulas finais em arrays/objetos.
- Integração com ESLint via `eslint-config-prettier`.
- Integração automática com Tailwind CSS via `prettier-plugin-tailwindcss`.

---

## ⚡ Biome

O projeto **deverá fornecer** uma configuração única (`biome/config`) que substitui ESLint + Prettier quando desejado.

- **Formatter**: estilo semelhante ao Prettier.
- **Linter**: ativa categorias `correctness`, `suspicious` e `style`.

---

## 🟦 TypeScript

O projeto **deverá incluir** arquivos `tsconfig.json` pré-configurados:

- `typescript/base`:
  - `"strict": true`
  - `"moduleResolution": "bundler"`
  - `"paths": { "@/*": ["src/*"] }`
- `typescript/react`:
  - Estende `base`
  - Adiciona `"jsx": "react-jsx"`

---

## 🎨 Stylelint

O projeto **deverá incluir**:

- `stylelint/base` → regras para CSS/SCSS.
- `stylelint/styled` → suporte para Styled Components / CSS-in-JS.

**Regras obrigatórias**:

- Ordenação de propriedades (`stylelint-order`).
- Bloqueio de `!important`.
- Padronização de cores e unidades.

---

## 🧪 Vitest (Testes Unitários)

O projeto **deverá fornecer** uma configuração padrão em `tests/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    coverage: { reporter: ['text', 'html'] },
  },
});
```

O projeto deverá fornecer uma configuração padrão em tests/playwright.config.ts:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: [['list'], ['html']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
});
```

# 🚀 Exemplo de Uso (ESLint + Tailwind)

O projeto deverá permitir configuração simples no eslint.config.js:

```js
// eslint.config.js
import { base, react, tailwind } from '@Tonybsilva-Dev/code-kit/eslint';

export default [
  ...base,
  ...react,
  ...tailwind,
  {
    rules: {
      'no-console': 'warn',
    },
  },
];
```

# 📜 Scripts Recomendados

O projeto deverá recomendar os seguintes scripts no package.json:

```bash
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "check:types": "tsc --noEmit",
    "stylelint": "stylelint '**/*.{css,scss}' --fix",
    "test": "vitest",
    "test:e2e": "playwright test"
  }
}
```

# 🛠 Compatibilidade

O projeto deverá ser compatível com:

```bash
Node.js → >= 18
ESLint → >= 9
TypeScript → >= 5
Prettier → >= 3
Biome → >= 1
Stylelint → >= 15
Vitest → >= 1
Playwright → >= 1.45
```

# 🗺️ Roadmap de Expansão

O projeto deverá futuramente incluir:

- Suporte para Cypress.
- Integração com Jest (legado).
- Commitlint + Husky.
- Guia para monorepos (Turborepo/Nx).
- Exemplos práticos de antes/depois com lint/format.
- Automação de setup inicial via CLI (create-code-kit).
