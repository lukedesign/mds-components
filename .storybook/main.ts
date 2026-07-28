import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // Stories vivem junto dos componentes web; MDX de documentação em src/docs.
  stories: ['../packages/web/src/**/*.stories.tsx', '../src/docs/**/*.mdx'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  // Fontes auto-hospedadas ficam em public/fonts e são servidas em /fonts/*
  // (ver .storybook/preview-head.html e public/fonts/README.md).
  staticDirs: ['../public'],
  docs: {
    defaultName: 'Docs',
  },
  viteFinal: (config) => {
    // @mds/tokens e os pacotes do workspace entram como symlink + fonte .ts —
    // deixar o esbuild transpilar direto, sem pré-bundle (mesmo motivo do
    // vite.config.ts do playground).
    config.optimizeDeps = {
      ...config.optimizeDeps,
      exclude: [
        ...(config.optimizeDeps?.exclude ?? []),
        '@mds/tokens',
        '@mds/components-web',
        '@mds/components-core',
      ],
    };
    return config;
  },
};

export default config;
