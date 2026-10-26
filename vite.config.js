import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('/node_modules/')) return undefined;

          if (id.includes('/@mui/x-data-grid/')) return 'mui-data-grid';
          if (id.includes('/@mui/')) return 'mui';
          if (id.includes('/@emotion/')) return 'emotion';
          if (id.includes('/@stripe/')) return 'stripe';
          if (id.includes('/react-dom/')) return 'react-dom';
          if (id.includes('/react/')) return 'react';
          if (id.includes('/react-router')) return 'router';

          return 'vendor';
        },
      },
    },
  },
});
