// @ts-check
import { defineConfig } from 'astro/config';
import fs from 'fs';
import path from 'path';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

import compress from '@playform/compress';

// Read CMS settings to load the dynamic site URL for sitemaps/SEO
const settingsPath = path.resolve('./src/content/settings/main.json');
let siteUrl = 'https://desamakmur.go.id'; // Default fallback
try {
  const settingsData = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  if (settingsData.siteUrl) siteUrl = settingsData.siteUrl;
} catch (error) {
  console.warn("Could not read siteUrl from settings:", error instanceof Error ? error.message : String(error));
}

// https://astro.build/config
export default defineConfig({
  site: siteUrl,

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sitemap(),
    compress()
  ],
  adapter: cloudflare()
});