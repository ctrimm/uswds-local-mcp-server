import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://uswdsmcp.com',
  output: 'static',
  build: {
    assets: 'assets',
  },
  integrations: [react()],
});
