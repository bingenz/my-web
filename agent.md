# Agent Rules

## Project Scope

- This repo is a static landing page for `bingenz.com`.
- Source of truth is `public/`.
- Build output is `dist/`.
- Deployment is handled by GitHub Actions and Cloudflare.

## Files You May Edit

- `public/**`
- `scripts/**`
- `README.md`
- `package.json`
- `agent.md`

## Files You Must Not Edit Directly

- `dist/**`
- Generated build output unless the user explicitly asks for debugging artifacts

## UI Rules

- Keep the current slate/navy gradient palette.
- Do not reintroduce the old purple-heavy palette.
- Exception: product/service illustration colors that the user explicitly keeps as original reference art may remain unchanged.
- Reuse existing tokens in `public/assets/css/main.css` when possible.
- Prefer shared CSS classes over adding new inline styles.
- Preserve the current visual language unless the user explicitly asks for a redesign.

## Data Rules

- Product data lives in `public/assets/js/products.js`.
- Do not add new product fields unless the UI actually renders them.
- If a field becomes unused, remove it instead of leaving dead data behind.
- Product ordering must continue to flow through `DISPLAY_ORDER`.
- Do not keep legacy marketing copy in product data when the current UI does not use it.
- If the user rejects old copy, tags, bullets, or labels, delete them from source instead of merely hiding them in the UI.

## JavaScript Rules

- Main interaction logic lives in `public/assets/js/app.js`.
- Do not keep dead selectors, dead event handlers, or unused helper functions.
- Any new modal or popup must include open, close, and UI state reset behavior.
- Preserve working flows for:
  - product modal
  - Zalo popup
  - copy-to-clipboard buttons
  - redirect/status toast
  - welcome popup

## Metadata Rules

- Social metadata is edited directly in `public/index.html`.
- Do not reintroduce sync scripts for share meta.
- Current requirement is text preview only: title + description.
- `og:image` is optional and should remain unchanged unless the user explicitly asks for a share image.

## Encoding Rules

- Save text files as UTF-8.
- Avoid mojibake or broken text such as `Ã`, `Â`, `Ä`, `ï¿½` in user-facing content.
- If editing README, prefer simple ASCII wording when it avoids GitHub rendering issues.

## Build and Verification

- After changes, run:
  - `npm run build`
  - `npm run check`
- Do not run `build` and `check` in parallel.
- If the task changes visible UI, verify against a local preview when practical.

## Repo Discipline

- Do not add frameworks, bundlers, or major architecture changes unless the user explicitly asks.
- Do not migrate this project to React, Next.js, Vite, Tailwind, or any SPA setup by default.
- Keep changes minimal, local, and consistent with the current static-site structure.
- Do not restore old content, old UI blocks, old colors, or old copy from git history unless the user explicitly asks for that exact restoration.
- When using git history for reference, treat it as read-only context, not as approval to bring old content back.
