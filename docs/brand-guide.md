# Folio brand guide

Folio helps people turn their experience, skills, and projects into one clear professional story. The identity should feel editorially confident, useful, and human rather than decorative or corporate.

## Logo system

The primary signature combines the original sparkle symbol with the lowercase wordmark `folio.`. The sparkle represents the moment a person's work becomes clear and ready to share.

- Use `public/brand/folio-lockup.svg` for the signature.
- Keep clear space around the signature equal to half the height of the sparkle tile.
- Keep the complete lockup at least 92 px wide on screen and the standalone tile at least 24 px wide.
- The sparkle always uses warm Paper on the fixed Deep Iris background (`--brand-logo-background`). This treatment does not change between light and dark themes.
- The browser and Apple icons use the same fixed sparkle treatment without the wordmark because of their constrained square format.

Do not remove the period, change the sparkle background by theme, stretch, outline, add gradients, rearrange the lockup, or place it on a visually noisy background.

## Default imagery

The default portfolio cover extends the logo treatment without turning the cover into an advertisement. It uses a fixed Deep Iris foundation, warm Paper sparkle geometry, quiet grid structure, and restrained Amber light. Keep cover artwork text-free so it supports every user's name, profession, and profile image. Place the strongest motif near the horizontal center so it survives responsive `object-cover` cropping.

## Color

The canonical source values live in `src/styles/globals.css` as CSS custom properties.

| Role | Token | Purpose |
| --- | --- | --- |
| Paper | `--brand-paper` | Warm light canvas and light logo foreground |
| Ink | `--brand-ink` | Primary text, logo tile, and high-contrast surfaces |
| Iris | `--brand-iris` | Primary actions, focus, and identity accents |
| Deep Iris | `--brand-iris-deep` | Accessible accent text on light surfaces |
| Pale Iris | `--brand-iris-pale` | Quiet accent backgrounds |
| Amber | `--brand-amber` | Highlights and moments of emphasis |
| Logo Iris | `--brand-logo-background` | Fixed sparkle-tile background in every theme |

Use semantic design-system tokens in product UI rather than referencing brand primitives directly. Light and dark themes deliberately map the palette to different semantic contrast levels.

## Typography and naming

Inter is the product and identity typeface. The wordmark is bold, tightly tracked, lowercase, and always includes its period: `folio.`

Use **Folio** in prose, metadata, navigation labels, and spoken references. Use **portfolio** as a common noun for a person's published body of work. Do not write `FOLIO`, `Folio.`, or `folio` as the product name.

## Voice

- Be clear, encouraging, and specific.
- Focus on a person's work and professional story, not on the software itself.
- Prefer direct verbs such as “build,” “connect,” “show,” and “share.”
- Avoid hype, jargon, and claims that the product can replace a person's judgment or experience.

## Accessibility

The linked signature must use the accessible name “Folio home,” while the sparkle artwork remains hidden from assistive technology. Maintain WCAG AA contrast for logo treatments, preserve visible keyboard focus, and never rely on color alone to communicate meaning.
