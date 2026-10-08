import { defineConfig } from 'vite';

// Project pages are served from /<repo>/, so assets need that base in production.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/model-comparision/',
});
