import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://brianmeeker.me/',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
