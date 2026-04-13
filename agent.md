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
- Remove superseded UI workarounds, temporary cache-busting, and duplicate overrides once the final fix is in place.
- Any new modal or popup must include open, close, and UI state reset behavior.
- Preserve working flows for:
  - product modal
  - Zalo popup
  - copy-to-clipboard buttons
  - status toast (`showStatusToast` — self-contained, no external HTML element dependency)
  - welcome popup

## Social Links and External References

- Canonical social links for this project:
  - TikTok: `https://www.tiktok.com/@bingenz_`
  - Instagram: `https://www.instagram.com/bingenz_ig`
  - GitHub: `https://github.com/bingenz`
  - Facebook: `https://www.facebook.com/share/1AUUKX6NHa/`
  - Telegram: `https://t.me/binpinkgold`
- When updating a social link, search and replace ALL occurrences across `index.html` — header, social-strip section, and contact section each have their own copy.
- Do not add new external brand references (sponsor blocks, ad banners, partner cards) unless the user explicitly requests them.
- When a sponsor or partner block is removed, delete all related HTML, CSS classes, JS handlers, and asset files (images, etc.) in the same commit. Do not leave orphaned `.wlc-ad`, `.redirect-toast`, or similar component CSS behind.

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

## Required Testing After Every Change

- After finishing any task, test the logic you changed before handoff.
- Test all affected buttons, links, toggles, popups, close actions, and copy actions.
- Test all affected UI states, hover states, disabled states, open/close states, transitions, and animations.
- If the task affects scrolling, sticky/fixed UI, overlays, or mobile behavior, test those flows specifically.
- Verify that no existing working flow was broken while fixing the requested issue.
- Include a short testing summary in the final handoff covering what was tested and the result.
- Do not mark work as complete if logic, buttons, and visible effects were not tested.

## Legacy Code and Cleanup Rules

- Do not reintroduce or reuse legacy code, old UI patterns, old styles, old handlers, old copy, or deprecated data unless the user explicitly asks for that exact restoration.
- When a feature, component, section, field, button, effect, or flow is removed, delete all related code completely instead of hiding, bypassing, or leaving partial leftovers.
- Full removal includes related HTML, CSS, JS, selectors, listeners, helper functions, state, assets, mock data, content, and config references tied to the removed behavior.
- Do not leave commented-out old code, legacy fallback branches, temporary compatibility code, or unused duplicate implementations in the final source.
- Do not restore old content, old UI blocks, old colors, or old copy from git history unless the user explicitly asks for that exact restoration.
- When using git history for reference, treat it as read-only context, not as approval to bring old content back.

## Repo Discipline

- Do not add frameworks, bundlers, or major architecture changes unless the user explicitly asks.
- Do not migrate this project to React, Next.js, Vite, Tailwind, or any SPA setup by default.
- Keep changes minimal, local, and consistent with the current static-site structure.
