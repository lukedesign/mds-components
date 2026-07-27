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
npm install          # instala tudo (workspaces + link p/ ../mds-tokens)
npm run dev          # playground Vite (localhost:5173)
npm run typecheck    # tsc em todos os pacotes
npm run sync-tokens  # regenera packages/core/src/generated/button-tokens.ts
```

> O repo de tokens precisa estar em `../mds-tokens` **com `dist/` buildado**
> (`npm run build` lá) — o playground importa `@mds/tokens/web/*` direto do
> dist.

Ver [CLAUDE.md](CLAUDE.md) para as decisões de arquitetura (de onde vem cada
valor, o que é provisório e por quê).
