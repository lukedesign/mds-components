import { useMemo, useState } from 'react';
import { Button, Input, MdsProvider } from '@mds/components-web';
import type {
  ButtonFamily,
  ButtonRole,
  ButtonStyleMode,
  ButtonVariant,
  MdsTokens,
  RadiusScale,
} from '@mds/components-core';

import * as mrv from '@mds/tokens/web/mrv';
import * as sensia from '@mds/tokens/web/sensia';
import * as luggo from '@mds/tokens/web/luggo';
import * as mrvCo from '@mds/tokens/web/mrvCo';
import * as classBrand from '@mds/tokens/web/class';
import * as mdc from '@mds/tokens/web/mdc';
import * as urba from '@mds/tokens/web/urba';
import * as superApp from '@mds/tokens/web/superApp';

type Mode = 'light' | 'dark';

const BRANDS = {
  mrv: { label: 'MRV', modules: mrv },
  sensia: { label: 'Sensia', modules: sensia },
  luggo: { label: 'Luggo', modules: luggo },
  mrvCo: { label: 'CO', modules: mrvCo },
  class: { label: 'Class', modules: classBrand },
  mdc: { label: 'MDC', modules: mdc },
  urba: { label: 'Urba', modules: urba },
  superApp: { label: 'SuperApp', modules: superApp },
} as const;

type BrandKey = keyof typeof BRANDS;

const VARIANTS: ButtonVariant[] = ['preenchido', 'contornado', 'naoPreenchido'];
const STYLE_MODES: ButtonStyleMode[] = ['default', 'alternate', 'inverse'];
const FAMILY_ROWS: Array<{ family: ButtonFamily; role?: ButtonRole; title: string }> = [
  { family: 'brand', role: 'primary', title: 'brand / primary' },
  { family: 'brand', role: 'secondary', title: 'brand / secondary' },
  { family: 'brand', role: 'tertiary', title: 'brand / tertiary' },
  { family: 'brand', role: 'complementary', title: 'brand / complementary' },
  { family: 'feedback', role: 'info', title: 'feedback / info' },
  { family: 'feedback', role: 'success', title: 'feedback / success' },
  { family: 'feedback', role: 'caution', title: 'feedback / caution' },
  { family: 'feedback', role: 'critical', title: 'feedback / critical' },
  { family: 'neutral', title: 'neutral' },
];

export function App() {
  const [brand, setBrand] = useState<BrandKey>('mrv');
  const [mode, setMode] = useState<Mode>('light');
  const [radiusScale, setRadiusScale] = useState<RadiusScale>('base');
  const [styleMode, setStyleMode] = useState<ButtonStyleMode>('default');

  const tokens = useMemo(
    () => BRANDS[brand].modules[mode].tokens as unknown as MdsTokens,
    [brand, mode],
  );

  const bg = styleMode === 'inverse' ? tokens.interface.primaryContainer : tokens.interface.background;
  const fg = styleMode === 'inverse' ? tokens.interface.onPrimaryContainer : tokens.interface.onBackground;

  return (
    <MdsProvider tokens={tokens} radiusScale={radiusScale}>
      <div style={{ minHeight: '100vh', background: bg, color: fg, padding: 24 }}>
        <header style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 20, margin: 0 }}>MDS Components — Playground</h1>
          <label>
            Marca{' '}
            <select value={brand} onChange={(e) => setBrand(e.target.value as BrandKey)}>
              {Object.entries(BRANDS).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            Modo{' '}
            <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
              <option value="light">light</option>
              <option value="dark">dark</option>
            </select>
          </label>
          <label>
            Radii{' '}
            <select value={radiusScale} onChange={(e) => setRadiusScale(e.target.value as RadiusScale)}>
              <option value="base">base</option>
              <option value="producao">producao</option>
            </select>
          </label>
          <label>
            Style{' '}
            <select value={styleMode} onChange={(e) => setStyleMode(e.target.value as ButtonStyleMode)}>
              {STYLE_MODES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
        </header>

        <section>
          <h2 style={{ fontSize: 16 }}>Button — variantes × famílias ({styleMode})</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {FAMILY_ROWS.map(({ family, role, title }) => (
              <div key={title} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <span style={{ width: 180, fontSize: 12, opacity: 0.8 }}>{title}</span>
                {VARIANTS.map((variant) => (
                  <Button key={variant} variant={variant} family={family} colorRole={role} styleMode={styleMode} size="mediumL">
                    {variant}
                  </Button>
                ))}
                <Button family={family} colorRole={role} styleMode={styleMode} size="mediumL" disabled>
                  disabled
                </Button>
                <Button family={family} colorRole={role} styleMode={styleMode} size="mediumL" loading>
                  loading
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 16 }}>Button — tamanhos e raios</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <Button size="large">large</Button>
            <Button size="mediumL">mediumL</Button>
            <Button size="mediumS">mediumS</Button>
            <Button size="small">small</Button>
            <Button size="mediumL" radius="small">radius small</Button>
            <Button size="mediumL" radius="large">radius large</Button>
            <Button size="mediumL" radius="full">radius full</Button>
            <Button size="mediumL" iconStart={<IconDot />}>com ícone</Button>
            <Button size="mediumL" iconOnly iconStart={<IconDot />} aria-label="Ação" />
            <Button size="mediumL" iconOnly loading iconStart={<IconDot />} aria-label="Carregando" />
          </div>
        </section>

        <section style={{ marginTop: 24, maxWidth: 420, display: 'grid', gap: 16 }}>
          <h2 style={{ fontSize: 16, margin: 0 }}>Input</h2>
          <Input label="Nome" placeholder="Digite seu nome" helperText="Como aparece no documento" fullWidth />
          <Input label="E-mail" placeholder="voce@exemplo.com" error helperText="E-mail inválido" fullWidth />
          <Input label="CPF" placeholder="000.000.000-00" disabled helperText="Campo bloqueado" fullWidth />
          <Input label="Busca" placeholder="Buscar..." radius="full" prefix={<IconDot size={20} />} fullWidth />
        </section>
      </div>
    </MdsProvider>
  );
}

function IconDot({ size }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size ?? '100%'} height={size ?? '100%'} aria-hidden="true">
      <circle cx="12" cy="12" r="6" fill="currentColor" />
    </svg>
  );
}
