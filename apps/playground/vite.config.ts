import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // @mds/tokens e os pacotes do workspace entram como symlink + fonte .ts —
  // deixar o esbuild do dev server transpilar direto, sem pré-bundle.
  optimizeDeps: {
    exclude: ['@mds/tokens', '@mds/components-web', '@mds/components-core'],
  },
});
