import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: 'https://expctr.com',
  integrations: [react(), sitemap(), partytown()],
  vite: {
    define: {
      'import.meta.env.SERVICE_DOMEIN': JSON.stringify(process.env.SERVICE_DOMEIN),
      'import.meta.env.API_KEY': JSON.stringify(process.env.API_KEY),
    }
  }
});