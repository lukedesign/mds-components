# MDS — Components (multimarcas)

Repo de componentes do Design System multimarcas. Consome os artefatos de
build do repo de tokens em `../mds-tokens` (`@mds/tokens`, dependência
`file:`). Leia também o CLAUDE.md de `../mds-tokens` — a seção "Fase 2 —
03-components" de lá é o contrato que este repo implementa.

## Arquitetura

Monorepo npm workspaces:

- **`packages/core`** (`@mds/components-core`) — sem dependência de
  plataforma/React. Contém:
  - `src/tokens-shape.ts`: tipo estrutural `MdsTokens` do objeto gerado pelo
    build de tokens (dimensões `string | number` porque web emite `"8px"` e
    RN emite `8`). Só o subconjunto que os componentes usam.
  - `src/generated/button-tokens.ts`: **gerado** por
    `scripts/sync-button-tokens.mjs` a partir de
    `../mds-tokens/00-tokens/03-components/buttons/` — guarda NOMES de token
    (`"visual"`, `"outline"`...), nunca valores. Não editar à mão; rodar
    `npm run sync-tokens` quando os JSONs de origem mudarem.
  - `src/button.ts` / `src/input.ts`: resolvers que transformam
    (styleMode × família × variante × estado) + objeto de tokens em cores/
    métricas finais.
- **`packages/web`** (`@mds/components-web`) — React DOM. Estados
  hover/active/focus/disabled via CSS custom properties por estado + uma
  folha estática injetada uma vez (`injectOnce`); sem CSS-in-JS externo.
- **`packages/react-native`** (`@mds/components-react-native`) — mesmos
  resolvers; estados via `Pressable`/`onFocus`; `toNumber()` normaliza
  dimensões.
- **`apps/playground`** — Vite, importa as 8 marcas de `@mds/tokens/web/*` e
  monta a matriz completa de variantes. É a ferramenta de verificação visual
  (`npm run dev`).

Os componentes **nunca importam uma marca**: o objeto de tokens entra via
`MdsProvider`. Por isso `@mds/tokens` só é dependência do playground.

## Decisões tomadas na criação (leia antes de mudar)

- **Fase 2, opção 2**: os tokens de variante de `03-components/` NÃO entram
  no build do repo de tokens; este repo codifica a matriz de variantes
  (via arquivo gerado) e resolve contra os tokens semânticos já existentes
  no dist (`visual.<papel>.*`, `feedback.<papel>.*`, `interface.*` como
  camada estável). Decisão alinhada com o CLAUDE.md do repo de tokens.
- **Resolução de nomes** (`resolveColorRef`): `visual*`/`onVisual*` →
  `tokens.visual[papel]`; `feedback*`/`onFeedback*` → `tokens.feedback[papel]`;
  qualquer outro nome → `tokens.interface.*`. Estados herdam de `normal`
  (ex.: `carregando` só redefine `bgColor`).
- **Nomenclatura PT dos valores de prop** (`preenchido`/`contornado`/
  `naoPreenchido`, estados `emFoco`/`sobre`/...) — mantida idêntica aos
  tokens/Figma para rastreabilidade. A prop de papel chama-se `colorRole`
  (não `role`) para não colidir com o atributo ARIA no web.
- **Tipografia dos tamanhos de botão**: os tokens de tamanho referenciam a
  escala crua (`{size.xSmall}`/`{lineHeight.xSmall}`) que não existe no dist;
  a ponte é `size.xSmall→label.large` e `size.xxSmall→label.small`
  (equivalência válida em todas as marcas — os composites de
  01-typography referenciam exatamente esses slots). Ver
  `FONT_SIZE_TO_LABEL` em `core/src/button.ts`. `iconSize` usa o
  `lineHeight` do mesmo composite.
- **Larguras de traço**: contorno 1.5px (escala global `small` do repo de
  tokens), anel de foco 2px (`medium`) — constantes nos pacotes de
  plataforma, já que a escala de borderWidth não está no shape.
- **`sdColor`** (sombra no estado pressionado) vira
  `0 2px 8px color-mix(... 25%)` no web; não aplicado no RN (sombras RN são
  outra API — pendente).
- **Cores do Input são PROVISÓRIAS**: a Fase 2 só define RAIO para inputs
  (`input.radius.*`). O mapa de cores por estado
  (`INPUT_COLOR_REFS` em `core/src/input.ts`) foi definido aqui sobre
  `interface.*` + `feedback.critical` seguindo o vocabulário de estados dos
  botões. Quando o design publicar tokens de cor de input, substituir esse
  mapa (idealmente gerando via sync, como no botão).
- **`radiusScale`** (`base` | `producao`) é escolhido no `MdsProvider`
  (default `producao`) porque os tokens de raio de botão/input apontam para
  `{medium}`/`{small}`/... sem fixar a escala de `01-radii`.
- **Loading desabilita o botão** (`disabled={disabled || loading}`) e troca o
  ícone por spinner; cores do estado `carregando` com fallback para `normal`.

## Comandos

```bash
npm install          # o repo ../mds-tokens precisa existir e ter dist/ buildado
npm run dev          # playground (Vite, porta 5173)
npm run typecheck    # tsc -p em core, web, react-native e playground
npm run sync-tokens  # regenera o mapa de variantes do botão
```

## Pendências conhecidas / próximos passos

- Sombra do estado pressionado no React Native (elevation/shadow*).
- Ícones: hoje o consumidor passa qualquer `ReactNode`; avaliar pacote de
  ícones do DS.
- Storybook próprio deste repo (o playground cobre a verificação hoje).
- Ao publicar os pacotes (deixar de ser `file:`), revisar `exports` para
  apontar para build compilado em vez de `src/*.ts`.
- Fonte Outfit: o playground carrega via Google Fonts; apps consumidores
  precisam embarcar a fonte da marca por conta própria.
