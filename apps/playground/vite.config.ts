import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Compartilha public/fonts com o Storybook — as fontes auto-hospedadas do
  // Design System ficam num lugar só (ver public/fonts/README.md).
  publicDir: fileURLToPath(new URL('../../public', import.meta.url)),
  // @mds/tokens e os pacotes do workspace entram como symlink + fonte .ts —
  // deixar o esbuild do dev server transpilar direto, sem pré-bundle.
  optimizeDeps: {
    exclude: ['@mds/tokens', '@mds/components-web', '@mds/components-core'],
  },
});
