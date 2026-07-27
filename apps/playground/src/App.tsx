import { useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  Dropzone,
  Input,
  InputAction,
  InputCode,
  InputDropdown,
  InputPassword,
  InputStepper,
  MdsProvider,
  Radio,
  Selector,
  StepHelper,
  Textarea,
} from '@mds/components-web';
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

const VARIANTS: ButtonVariant[] = ['filled', 'stroke', 'ghost', 'translucent', 'underline', 'text'];
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
          <h2 style={{ fontSize: 16, margin: 0 }}>Inputs</h2>
          <Input label="Nome" placeholder="Input Text" helperText="Input Helper" fullWidth />
          <Input label="Com ícone" placeholder="Input Text" helperText="Input Helper" icon={<IconDot />} fullWidth />
          <Input label="Carregando" placeholder="Input Text" helperText="Consultando..." loading fullWidth />
          <Input label="Feedback caution" defaultValue="Valor suspeito" feedback="caution" helperText="Confira este campo" fullWidth />
          <Input label="Feedback critical" defaultValue="Valor inválido" feedback="critical" helperText="Corrija este campo" fullWidth />
          <Input label="Feedback success" defaultValue="Tudo certo" feedback="success" helperText="Validado" fullWidth />
          <Input label="Desabilitado" placeholder="Input Text" helperText="Campo bloqueado" disabled fullWidth />
          <Input label="Desabilitado preenchido" defaultValue="Valor fixo" helperText="Campo bloqueado" disabled fullWidth />
          <InputPassword label="Senha" placeholder="••••••••" helperText="Mínimo de 8 caracteres" fullWidth />
          <InputAction label="Data" placeholder="00/00/0000" helperText="Abra o calendário" actionIcon={<IconDot />} actionLabel="Abrir calendário" onAction={() => console.log('action!')} fullWidth />
          <Textarea label="Mensagem" placeholder="Input Text" helperText="Input Helper" maxLength={140} icon={<IconDot />} fullWidth />
          <DropdownDemo />
          <InputCode label="Código de 6 dígitos" helperText="Enviado por SMS" fullWidth />
          <InputCode label="Código de 4 dígitos" length={4} feedback="critical" helperText="Código inválido" fullWidth />
          <InputStepper helperText="Quantidade" max={10} fullWidth />
          <DropzoneDemo />
        </section>

        <section style={{ marginTop: 24, maxWidth: 420, display: 'grid', gap: 12 }}>
          <h2 style={{ fontSize: 16, margin: 0 }}>Seleção</h2>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <Checkbox aria-label="Normal" />
            <Checkbox defaultChecked aria-label="Selecionado" />
            <Checkbox indeterminate aria-label="Indeterminado" />
            <Checkbox feedback="critical" aria-label="Feedback" />
            <Checkbox disabled aria-label="Desabilitado" />
            <Checkbox disabled defaultChecked aria-label="Desabilitado selecionado" />
            <RadioDemo />
            <Radio disabled aria-label="Radio desabilitado" />
            <Radio disabled selected aria-label="Radio desabilitado selecionado" />
          </div>
          <SelectorDemo />
          <div>
            <StepHelper state="idle">Ao menos 8 caracteres</StepHelper>
            <StepHelper state="checking">Verificando disponibilidade</StepHelper>
            <StepHelper state="alert">Evite sequências óbvias</StepHelper>
            <StepHelper state="unchecked">Precisa de um número</StepHelper>
            <StepHelper state="checked" counter="3/4">Tem letra maiúscula</StepHelper>
          </div>
        </section>
      </div>
    </MdsProvider>
  );
}

function DropdownDemo() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  return (
    <div style={{ display: 'grid', gap: 4 }}>
      <InputDropdown
        label="Estado"
        placeholder="Selecione..."
        helperText="Campo-gatilho (lista fora do escopo do Figma)"
        value={value}
        open={open}
        onToggle={setOpen}
        fullWidth
      />
      {open && (
        <div style={{ display: 'flex', gap: 8 }}>
          {['Minas Gerais', 'São Paulo'].map((option) => (
            <Button key={option} variant="ghost" size="small" onClick={() => { setValue(option); setOpen(false); }}>
              {option}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

function DropzoneDemo() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <Dropzone
      label="Documentos"
      helperText="PDF ou imagem"
      files={files}
      maxFiles={3}
      onFiles={setFiles}
      fullWidth
    />
  );
}

function RadioDemo() {
  const [selected, setSelected] = useState('a');
  return (
    <span role="radiogroup" style={{ display: 'inline-flex', gap: 12 }}>
      <Radio selected={selected === 'a'} onSelect={() => setSelected('a')} aria-label="Opção A" />
      <Radio selected={selected === 'b'} onSelect={() => setSelected('b')} aria-label="Opção B" />
      <Radio selected={selected === 'b'} feedback="info" onSelect={() => setSelected('b')} aria-label="Opção C" />
    </span>
  );
}

function SelectorDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {(['xSmall', 'small', 'medium', 'large', 'xLarge'] as const).map((size) => (
        <Selector
          key={size}
          size={size}
          control={
            <Checkbox
              size={{ xSmall: 20, small: 20, medium: 24, large: 24, xLarge: 32 }[size]}
              checked={checked}
              onChange={setChecked}
              aria-label={`Selector ${size}`}
            />
          }
          onPress={() => setChecked(!checked)}
        >
          Selector {size}
        </Selector>
      ))}
    </div>
  );
}

function IconDot({ size }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size ?? '100%'} height={size ?? '100%'} aria-hidden="true">
      <circle cx="12" cy="12" r="6" fill="currentColor" />
    </svg>
  );
}
