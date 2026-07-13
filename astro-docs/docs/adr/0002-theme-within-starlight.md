# Theme within Starlight, do not eject

We apply the twinsphere brand design as a Starlight *theme* rather than as bespoke page layouts. The design is treated as global docs chrome (brand colors, typography, header, sidebar) and implemented through the least-invasive layer that works: Starlight config options first, then a `customCss` file mapping brand values onto Starlight's `--sl-color-*` custom properties (light and dark pairs), and Starlight component overrides only where CSS genuinely cannot express the design. We deliberately do **not** eject into custom layouts or abandon the Starlight shell, because doing so would forfeit Starlight's built-in search, i18n, table of contents, and sidebar navigation — features we get for free and would otherwise have to rebuild. The accepted cost is that the design must adapt to Starlight's structure rather than the reverse; where the design conflicts with Starlight conventions, Starlight's reader UX wins.

## Consequences

- Both light and dark modes (and the theme toggle) are retained; the mode not fully specified by the design is derived from the same token set.
- A future contributor tempted to eject for pixel-perfect fidelity should weigh it against losing search/i18n/TOC — that trade was made here on purpose.
- Component overrides carry upgrade risk on Starlight version bumps; keep them minimal and prefer CSS.
