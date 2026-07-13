# Release notes live in a separate `releases` collection, not with the docs

The five product release-notes pages (Cloud, Studio, Viewer, DevKit, Rulebook) are stored in the `releases` content collection under `src/content/releases/`, not in the Starlight `docs` collection with the rest of the pages. We did this so the release notes can later be given a distinct layout (grouped/filtered version timelines) without disturbing the standard docs layout. Because a non-`docs` collection is not automatically routed by Starlight, each release-notes page is served today by a minimal dynamic route (`src/pages/[slug].astro`) that renders it with the default `<StarlightPage>` component at its original flat slug (e.g. `/cloud-release-notes/`) — so URLs and the sidebar are preserved now, and only the visual layout is deferred.

## Consequences

- Release-notes pages are **not** Starlight-native sidebar entries; they appear in the sidebar as explicit `link:` items pointing at their slugs.
- The `releases` schema requires only `title` (no `date`), because each file is a single page containing many versions rather than one file per dated release.
- When the bespoke layout is built, swap the rendering in `src/pages/[slug].astro` — the content does not move again.
