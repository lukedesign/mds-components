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
  rápida (`npm run dev`).
- **Storybook** (`npm run storybook`, porta 6007) — documentação viva:
  `.storybook/main.ts` lê `packages/web/src/**/*.stories.tsx` + `src/docs/**/
  *.mdx`; `.storybook/preview.tsx` define os globals **Marca/Modo/Radii** na
  toolbar e um decorator que envolve toda story em `<MdsProvider>` (o mesmo
  contrato do consumidor real). `.storybook/brands.ts` centraliza o import
  estático das 8 marcas.
  - `preview.tsx` **precisa de `import React`**: o arquivo de preview é
    transpilado fora do plugin React do Vite, sem JSX runtime automático
    (sem isso, toda story quebra com "React is not defined").
  - `viteFinal` repete o `optimizeDeps.exclude` do playground para
    `@mds/tokens` e os pacotes do workspace (fonte .ts via symlink).
  - Publicação: `.github/workflows/storybook.yml` faz checkout de
    `lukedesign/mds-tokens` como repo irmão, roda o build de tokens e
    depois `storybook:build`. Se o repo de tokens virar privado, o checkout
    precisa de um PAT.

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
- **Nomenclatura do `variant` = nomes dos componentes do Figma** (decisão do
  usuário em 2026-07-27): `filled` | `stroke` | `ghost` | `translucent` |
  `underline` | `text` (Button/Global/* em "Prebuild Components"). As três
  primeiras mapeiam 1:1 para os tokens PT (`VARIANT_TO_TOKEN` em
  `core/src/button.ts`: filled→preenchido, stroke→contornado,
  ghost→naoPreenchido); `translucent`/`underline`/`text` **não têm tokens
  próprios na Fase 2** — são derivadas em `resolveButtonStyles` dos mesmos
  tokens, com camadas de alpha/sublinhado medidos nos componentes do Figma:
  - translucent: rest `preenchido.normal.bgColor` @25%; hover
    `contornado.sobre.bgColor` @80%; pressed `sd` @25% + `bgColor` @40%
    (compostos em rgba via `core/src/color.ts`); disabled
    `onSurface` @30% com conteúdo a 60%; loading `carregando.bgColor` @25%.
  - underline: sem caixa; sublinhado no labelArea com cores de contornado —
    2px tracejado (rest) → 2px sólido (hover) → 4px tracejado (focus) → 4px
    sólido (pressed); **sem estado loading no Figma** (`hasLoading: false`).
  - text: idem underline sem sublinhado no rest; gap com ícone = `s-small`.
  Os estados internos seguem PT (`emFoco`/`sobre`/...) porque vêm dos tokens.
  A prop de papel chama-se `colorRole` (não `role`) para não colidir com o
  atributo ARIA no web.
- **Traço de caixa = `medium` (2px) em todos os estados** (medido no Figma:
  o Stroke usa 2px também no rest, não 1.5px); sublinhados usam `medium`
  (2px) e `large` (4px). Overlay sdPress: 25% no filled/ghost, 50% no
  stroke.
- **Tipografia dos tamanhos de botão**: os tokens de tamanho referenciam a
  escala crua (`{size.xSmall}`/`{lineHeight.xSmall}`) que não existe no dist;
  a ponte é `size.xSmall→label.large` e `size.xxSmall→label.small`
  (equivalência válida em todas as marcas — os composites de
  01-typography referenciam exatamente esses slots). Ver
  `FONT_SIZE_TO_LABEL` em `core/src/button.ts`. `iconSize` usa o
  `lineHeight` do mesmo composite.
- **Larguras de traço**: contorno 1.5px (escala global `small` do repo de
  tokens), borda de foco 2px (`medium`) — constantes nos pacotes de
  plataforma, já que a escala de borderWidth não está no shape.
- **Fidelidade ao componente publicado no Figma** (Button/Global/Filled,
  node 1534:14876 de "Prebuild Components", conferido em 2026-07-27):
  - `sdColor` (pressionado) é um **overlay interno a 25% de opacidade**
    (camada "sdPress" do Figma) — web via `::after`, RN via View absoluta.
  - Foco = **borda de 2px dentro do botão** (`emFoco.strokeColor`), não anel
    externo com offset.
  - **Loading esconde label e ícones** (só spinner) e fixa a largura em
    `minW` (iconOnly: quadrado `minH`).
  - **`iconOnly`**: prop booleana, botão quadrado `minH × minH`, padding 0.
  - **labelArea**: o respiro lateral do texto vem de padding no label
    (= `gap`), com gap 0 no container (`inline/null`), como no Figma.
  - **Padding vertical = 0**: o componente publicado vincula
    `{inset-deprecated.null}`, divergindo de `00-button.size.*.tokens.json`
    (`{inset-deprecated.xxxSmall}` = 8px). Seguimos o Figma (override em
    `core/src/button.ts`); **divergência a reportar ao design**.
- **Inputs conferidos contra o Figma** (página "Entrada & Seleção <global>",
  2026-07-27) — substituíram o mapa provisório da primeira versão:
  - Componentes desta rodada: `Input` (Input/simples), `InputPassword`
    (+ Password Visibility Action embutido), `InputAction` (ação embutida) e
    `Textarea` (Input/text, com contador "n/máx" no helper via `maxLength`).
    Web + RN; no RN os ícones do olho são props obrigatórias
    (`visibilityIcon`/`visibilityOffIcon`) porque não embutimos SVG lá.
  - Estados do inputfield (ver tabela em `core/src/input.ts`):
    normal 1px `outlineMuted` / sobre 2px `visualMuted` / emFoco 2px
    `inversePrimary` / ativo 1px `visual` / preenchido 2px
    `mutedOnBackground` / feedback 2px `feedback.<papel>` (texto/helper
    `onFeedbackContainer`) / desabilitado bg `backgroundMuted` + 2px
    `outlineMuted`. `deriveInputState` mapeia interação → estado:
    foco por teclado (focus-visible) = emFoco/preenchidoEmFoco; foco de
    ponteiro/digitação = ativo; RN passa focusVisible=false.
  - **`feedback` é um papel** (info/success/caution/critical), não booleano
    de erro — o Figma vincula `{feedback}` genérico.
  - Métricas: campo 44px, padding 12, gap 8, ícone 20, ação interna 32px com
    raio `radii.<escala>.small`; title 14/20, texto 16/20
    (`paragraph.medium`), helper 12/16; coluna com gap 4 e px 8.
  - Ícones funcionais (olho, info, alerta) embutidos em
    `web/src/icons.tsx` com os paths exatos exportados do Figma.
  - **Rodadas seguintes (mesma data) — compostos e seleção**, todos web+RN:
    - `InputDropdown`: só o campo-gatilho (chevron de 32px que gira 180° com
      `open`; lista aberta = estado ativo). **A lista suspensa não está
      desenhada no Figma** — fica a cargo do consumidor por enquanto.
    - `InputCode`: 4 ou 6 caixas de 44px (gap `s-small`), auto-avanço,
      estado por caixa (focada=ativo, com dígito=preenchido).
    - `InputStepper`: botões circulares de 32px com as cores do Button
      preenchido (via `resolveButtonStyles`), campo central min-w 46, linha
      com gap `s-xLarge` e px 12; valor 0 usa cor de placeholder.
    - `Dropzone`: borda TRACEJADA (border real, não box-shadow), conteúdo em
      coluna centrada (clipe + texto), dragover=sobre, contador de arquivos
      no helper. RN sem drag&drop (onPress abre o picker do app).
    - `Checkbox` (24px, raio `radii.<escala>.small`; normal bg `surface` +
      2px `subtleOnSurface`; selecionado/indeterminado bg `primary`) e
      `Radio` (circular; normal bg `backgroundSubtle` + 2px `outlineMuted` —
      borda de normal DIFERENTE do checkbox, conferido) — estados em
      `core/src/selection.ts`; acentos em `interface.primary*`, não
      `visual.*`.
    - `Selector`: linha controle+texto em 5 tamanhos (controle 20/20/24/24/
      32; texto 12/20, 14/20, 16/24, 18/24, 18/32, cor `onSurface`).
    - **Clique no checkbox `indeterminate` MARCA** (não desmarca) — o Figma
      só define o visual do estado; seguimos o `<input type="checkbox">`
      nativo, onde `indeterminate` é puramente visual e o clique alterna
      `checked`. É o comportamento esperado num "selecionar todos" parcial.
    - `StepHelper`: checklist idle/checking/alert/unchecked/checked — ícones
      12px nas cores caution/critical/success; texto 12/16 `onBackground`.
    - No RN os glifos sem SVG são desenhados com Views/Text (check ✓,
      −/+, ponto do radio, anel do step helper) e aceitam ícone via prop.
- **`radiusScale`** (`base` | `producao`) é escolhido no `MdsProvider`
  (default `base`) porque os tokens de raio de botão/input apontam para
  `{medium}`/`{small}`/... sem fixar a escala de `01-radii`. O default veio
  do componente publicado no Figma, que resolve `{medium}` = 8px (escala
  base; producao teria 16px).
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
