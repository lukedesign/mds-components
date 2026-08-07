# ⚠️ Repositório arquivado — o MDS agora vive em um repo único

Os componentes foram unificados com os design tokens num único repositório:

### 👉 **[lukedesign/mds-design-system](https://github.com/lukedesign/mds-design-system)**

### 📖 Documentação: **https://lukedesign.github.io/mds-design-system/**

O conteúdo deste repo está lá na raiz (`packages/core`, `packages/web`,
`packages/react-native`, `apps/playground`), **com todo o histórico de commits
preservado** — nada foi perdido na migração.

## Por quê

Este repo consumia o de tokens por uma dependência `file:` apontando para um
repo irmão, e o CI precisava clonar os dois para conseguir buildar. Eram
inseparáveis na prática, separados só no nível do git.

Juntando, três coisas melhoraram de uma vez:

- A lista das 8 marcas existia em **três cópias sincronizadas à mão** (duas
  delas aqui, em `.storybook/brands.ts` e no repo de tokens). Agora é um
  arquivo só, e marca nova aparece na toolbar sozinha depois do build.
- Eram **dois Storybooks**, cada um com sua própria toolbar de marca — um
  explicando de onde vem cada cor, outro mostrando os componentes. Agora é um
  só, e a mesma seleção vale para as duas coisas.
- O CI fazia checkout duplo (este repo + o de tokens). Agora é um checkout.

Este repositório não recebe mais atualizações. Abra issues e PRs no repo novo.

---

<sub>Conteúdo original abaixo, para referência histórica.</sub>

# MDS — Components (multimarcas)

Componentes do Design System multimarcas, consumindo os tokens de
[`../mds-tokens`](../mds-tokens) (`@mds/tokens`, via `file:`). Monorepo npm
workspaces com três pacotes + um playground:

```
packages/core/           @mds/components-core          — tipos + resolvers de token (sem plataforma)
packages/web/            @mds/components-web           — React (DOM)
packages/react-native/   @mds/components-react-native  — React Native
apps/playground/         @mds/playground               — Vite app p/ verificação visual (web)
scripts/sync-button-tokens.mjs — regenera o mapa de variantes do Button a partir do repo de tokens
```

## Uso (web)

```tsx
import { MdsProvider, Button, Input } from '@mds/components-web';
import { light } from '@mds/tokens/web/mrv';

<MdsProvider tokens={light.tokens} radiusScale="producao">
  <Button variant="preenchido" family="brand" colorRole="primary" size="large">
    Continuar
  </Button>
  <Input label="Nome" helperText="Como aparece no documento" />
</MdsProvider>
```

React Native: mesmo API, importando de `@mds/components-react-native` e
`@mds/tokens/react-native/<marca>`.

Os componentes **não importam nenhuma marca** — o objeto de tokens entra pelo
`MdsProvider`, então a troca de marca/modo é trocar o objeto (as 8 marcas ×
light/dark do build do repo de tokens funcionam sem mudança de código).

## Comandos

```bash
npm install           # instala tudo (workspaces + link p/ ../mds-tokens)
npm run storybook     # Storybook dos componentes (localhost:6007)
npm run storybook:build  # build estático em storybook-static/
npm run dev           # playground Vite (localhost:5173)
npm run typecheck     # tsc em todos os pacotes
npm run sync-tokens   # regenera packages/core/src/generated/button-tokens.ts
```

## Storybook

`npm run storybook` sobe a documentação viva dos componentes. A toolbar tem
três seletores globais — **Marca** (as 8 do build), **Modo** (light/dark) e
**Radii** (`base`/`producao`) — e um decorator envolve toda story em
`<MdsProvider>`, então a troca vale para todas as stories de uma vez.

As stories ficam ao lado dos componentes (`packages/web/src/*.stories.tsx`) e
a documentação em MDX em `src/docs/`. O push para `main` publica no GitHub
Pages via [.github/workflows/storybook.yml](.github/workflows/storybook.yml),
que faz checkout do `mds-tokens` como repo irmão e roda o build de tokens
antes.

> **Atenção:** 5 das 8 marcas (Class, Luggo, CO, Sensia, Urba) hoje têm
> `light` e `dark` **idênticos** nos tokens de origem — trocar o modo nelas
> não muda nada. Isso é dado de origem do Figma, não do Storybook.

> O repo de tokens precisa estar em `../mds-tokens` **com `dist/` buildado**
> (`npm run build` lá) — o playground importa `@mds/tokens/web/*` direto do
> dist.

Ver [CLAUDE.md](CLAUDE.md) para as decisões de arquitetura (de onde vem cada
valor, o que é provisório e por quê).
