# Fontes do Design System

Os tokens declaram apenas o **nome** da família (`00-fontFamily`); os arquivos
não vêm do repo de tokens. Coloque-os aqui para que o Storybook e o playground
renderizem com a tipografia real.

| Família | Marcas | Arquivo esperado |
|---|---|---|
| Outfit | MRV, Sensia, Luggo, CO, Class, Urba, SuperApp | `Outfit-Variable.woff2` |
| Aileron | MDC | `Aileron-Regular.woff2`, `Aileron-SemiBold.woff2`, `Aileron-Bold.woff2` |

## Como obter

- **Outfit** — open source (SIL Open Font License), disponível no Google
  Fonts. Enquanto `Outfit-Variable.woff2` não estiver aqui, o Storybook carrega
  a Outfit pelo CDN do Google (ver `.storybook/preview-head.html`), então ela
  já aparece corretamente — auto-hospedar serve para funcionar offline e não
  depender de CDN externo.
- **Aileron** — **não está no Google Fonts**. Precisa vir do time de design
  (é a fonte da marca MDC). Sem o arquivo aqui, as stories em MDC caem no
  fallback do sistema e a tipografia fica errada.

Os pesos usados pelas escalas tipográficas são 400 (regular), 600 (semiBold) e
700 (bold); a Outfit variável cobre 100–900 num arquivo só.

Este diretório é servido como estático pelo Storybook (`staticDirs` em
`.storybook/main.ts`), então os arquivos ficam disponíveis em `/fonts/<arquivo>`.
