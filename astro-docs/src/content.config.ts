import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema(),
});

// Product release-notes pages. Each file is a single page containing many
// versions, so there is no per-file `date`. Rendered today via a minimal
// dynamic route (src/pages/[slug].astro) with the default Starlight layout;
// a bespoke layout is planned. See docs/adr/0001-release-notes-separate-collection.md
const releases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/releases' }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { docs, releases };
