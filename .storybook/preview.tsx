// O arquivo de preview é transpilado fora do plugin React do Vite, sem o JSX
// runtime automático — por isso o React precisa estar em escopo aqui.
import React from 'react';
import type { Decorator, Preview } from '@storybook/react-vite';
import { MdsProvider } from '@mds/components-web';
import type { RadiusScale } from '@mds/components-core';
import { BRANDS, DEFAULT_BRAND, DEFAULT_MODE, tokensFor, type BrandKey, type Mode } from './brands';

/** Envolve toda story no MdsProvider da marca/modo ativos na toolbar e pinta
 * o fundo do canvas com o `background` da marca (o componente não desenha o
 * fundo da página, quem faz isso é a aplicação). */
const withMdsTheme: Decorator = (Story, context) => {
  const brand = (context.globals.brand ?? DEFAULT_BRAND) as BrandKey;
  const mode = (context.globals.mode ?? DEFAULT_MODE) as Mode;
  const radiusScale = (context.globals.radiusScale ?? 'base') as RadiusScale;
  const tokens = tokensFor(brand, mode);

  return (
    <MdsProvider tokens={tokens} radiusScale={radiusScale}>
      <div
        style={{
          background: tokens.interface.background,
          color: tokens.interface.onBackground,
          fontFamily: tokens.paragraph.medium.fontFamily,
          padding: 24,
          minHeight: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Story />
      </div>
    </MdsProvider>
  );
};

const preview: Preview = {
  decorators: [withMdsTheme],
  globalTypes: {
    brand: {
      name: 'Marca',
      description: 'Marca ativa dos design tokens',
      defaultValue: DEFAULT_BRAND,
      toolbar: {
        icon: 'paintbrush',
        items: Object.entries(BRANDS).map(([value, { label }]) => ({ value, title: label })),
        dynamicTitle: true,
      },
    },
    mode: {
      name: 'Modo',
      description: 'Tema ativo (light/dark)',
      defaultValue: DEFAULT_MODE,
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'light' },
          { value: 'dark', title: 'dark' },
        ],
        dynamicTitle: true,
      },
    },
    radiusScale: {
      name: 'Radii',
      description: 'Escala de raio de 01-radii',
      defaultValue: 'base',
      toolbar: {
        icon: 'component',
        items: [
          { value: 'base', title: 'base' },
          { value: 'producao', title: 'producao' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    options: {
      storySort: {
        order: [
          'Introdução',
          'Ações',
          ['Button'],
          'Entrada',
          ['Input', 'Input Password', 'Input Action', 'Textarea', 'Input Dropdown', 'Input Code', 'Input Stepper', 'Dropzone'],
          'Seleção',
          ['Checkbox', 'Radio', 'Selector', 'Step Helper'],
        ],
      },
    },
  },
};

export default preview;
