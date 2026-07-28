# Fontes do Design System

Os tokens declaram apenas o **nome** da família (`00-fontFamily`); os arquivos
não vêm do repo de tokens. Eles ficam aqui, auto-hospedados — sem CDN, então o
Storybook e o playground funcionam offline.

Servidos em `/fonts/*` pelo Storybook (`staticDirs` em `.storybook/main.ts`) e
pelo playground (`publicDir` em `apps/playground/vite.config.ts`). As
declarações `@font-face` vivem em `.storybook/preview-head.html` e
`apps/playground/index.html`.

## Arquivos

| Família | Marcas | Arquivos | Origem | Licença |
|---|---|---|---|---|
| Outfit | MRV, Sensia, Luggo, CO, Class, Urba, SuperApp | `Outfit-Variable-latin.woff2`, `Outfit-Variable-latin-ext.woff2` | Google Fonts (`fonts.gstatic.com`, v15) | SIL Open Font License 1.1 |
| Aileron | MDC | `Aileron-Regular.woff2` (400), `Aileron-SemiBold.woff2` (600), `Aileron-Bold.woff2` (700) | [`@fontsource/aileron`](https://fontsource.org/fonts/aileron) 5.3.0 via jsDelivr | CC0 1.0 (domínio público) |

A Outfit é **variável** (100–900 num arquivo por subset), então cobre todos os
pesos das escalas tipográficas. A Aileron é estática — baixamos só os três
pesos que as escalas usam (regular/semiBold/bold). Ambas cobrem o subset
`latin`, que inclui todos os acentos do português.

## Como atualizar

**Outfit** — pegue as URLs atuais do Google Fonts e baixe os dois subsets:

```bash
curl -H "User-Agent: Mozilla/5.0" \
  "https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap"
# copie as URLs .woff2 (latin e latin-ext) e salve com os nomes acima
```

**Aileron** — troque a versão na URL:

```bash
curl -o Aileron-Regular.woff2 \
  "https://cdn.jsdelivr.net/npm/@fontsource/aileron@5.3.0/files/aileron-latin-400-normal.woff2"
```

> Se o time de design fornecer arquivos oficiais/licenciados diferentes destes,
> basta substituí-los mantendo os mesmos nomes — nenhuma configuração muda.
