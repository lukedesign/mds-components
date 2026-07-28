import type { MdsTokens } from '@mds/components-core';

import * as mrv from '@mds/tokens/web/mrv';
import * as sensia from '@mds/tokens/web/sensia';
import * as luggo from '@mds/tokens/web/luggo';
import * as mrvCo from '@mds/tokens/web/mrvCo';
import * as classBrand from '@mds/tokens/web/class';
import * as mdc from '@mds/tokens/web/mdc';
import * as urba from '@mds/tokens/web/urba';
import * as superApp from '@mds/tokens/web/superApp';

export type Mode = 'light' | 'dark';

/** As 8 marcas do build de tokens — `key` bate com a pasta de dist/web/. */
export const BRANDS = {
  mrv: { label: 'MRV', modules: mrv },
  sensia: { label: 'Sensia', modules: sensia },
  luggo: { label: 'Luggo', modules: luggo },
  mrvCo: { label: 'CO', modules: mrvCo },
  class: { label: 'Class', modules: classBrand },
  mdc: { label: 'MDC', modules: mdc },
  urba: { label: 'Urba', modules: urba },
  superApp: { label: 'SuperApp', modules: superApp },
} as const;

export type BrandKey = keyof typeof BRANDS;

export const DEFAULT_BRAND: BrandKey = 'mrv';
export const DEFAULT_MODE: Mode = 'light';

export function tokensFor(brand: BrandKey, mode: Mode): MdsTokens {
  return BRANDS[brand].modules[mode].tokens as unknown as MdsTokens;
}
