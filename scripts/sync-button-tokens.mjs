/**
 * Regenera packages/core/src/generated/button-tokens.ts a partir dos tokens de
 * componente da Fase 2 do repo de tokens (00-tokens/03-components/buttons).
 *
 * Os arquivos de origem guardam REFERÊNCIAS semânticas ("{visual}", "{outline}"...)
 * — não valores. Este script só converte a estrutura JSON (família × preenchimento
 * × estado × propriedade -> nome do token semântico) para um objeto TS tipado;
 * quem resolve o nome para a cor final, por marca/modo, é o resolver do
 * @mds/components-core em tempo de execução, usando o objeto de tokens do
 * @mds/tokens.
 *
 * Rode `node scripts/sync-button-tokens.mjs` sempre que os arquivos de
 * 00-tokens/03-components/buttons mudarem no repo de tokens.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const TOKENS_REPO = resolve(here, '../../mds-tokens');
const BUTTONS_DIR = join(TOKENS_REPO, '00-tokens/03-components/buttons');
const OUT_FILE = resolve(here, '../packages/core/src/generated/button-tokens.ts');

const STYLES = ['default', 'alternate', 'inverse'];
const SIZES = ['large', 'mediumL', 'mediumS', 'small'];
const RADII = ['default', 'small', 'large', 'full'];

const readTokens = (file) => JSON.parse(readFileSync(join(BUTTONS_DIR, file), 'utf8'));

// "{visual}" -> "visual"; valor literal (ex.: "48px") passa como está.
const unwrap = ($value) =>
  typeof $value === 'string' && $value.startsWith('{') && $value.endsWith('}')
    ? $value.slice(1, -1)
    : $value;

// Converte uma árvore DTCG ({$type,$value} nas folhas) em objeto plano de referências.
function refs(node) {
  if (node && typeof node === 'object' && '$value' in node) return unwrap(node.$value);
  const out = {};
  for (const [key, child] of Object.entries(node)) out[key] = refs(child);
  return out;
}

const styleMap = Object.fromEntries(
  STYLES.map((style) => [style, refs(readTokens(`01-button.style.${style}.tokens.json`))]),
);

const sizeMap = Object.fromEntries(
  SIZES.map((size) => [size, refs(readTokens(`00-button.size.${size}.tokens.json`))]),
);

const radiusMap = Object.fromEntries(
  RADII.map((radius) => [radius, refs(readTokens(`00-button.radius.${radius}.tokens.json`)).radius]),
);

const banner = `// Gerado por scripts/sync-button-tokens.mjs — não edite manualmente.
// Fonte: ${'00-tokens/03-components/buttons'} (repo @mds/tokens).
// Os valores são NOMES de tokens semânticos (ou literais px); a resolução para
// valor final por marca/modo acontece no resolver de @mds/components-core.
`;

const ts = `${banner}
export const buttonStyleMap = ${JSON.stringify(styleMap, null, 2)} as const;

export const buttonSizeMap = ${JSON.stringify(sizeMap, null, 2)} as const;

export const buttonRadiusMap = ${JSON.stringify(radiusMap, null, 2)} as const;

export type ButtonStyleMode = keyof typeof buttonStyleMap;
export type ButtonFamily = keyof (typeof buttonStyleMap)['default'];
export type ButtonVariant = keyof (typeof buttonStyleMap)['default']['brand'];
export type ButtonState = keyof (typeof buttonStyleMap)['default']['brand']['preenchido'];
export type ButtonSize = keyof typeof buttonSizeMap;
export type ButtonRadius = keyof typeof buttonRadiusMap;
`;

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, ts);
console.log(`OK: ${OUT_FILE}`);
