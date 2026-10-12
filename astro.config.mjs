import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://schlaf-experten.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
