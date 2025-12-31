# Kazuki Kanda (KazukiKandaKK) Portfolio

Vanilla HTML/CSS/JS single-page portfolio served from the repository root.

## GitHub Pages deployment
- Push changes to `main`.
- In GitHub, open Settings > Pages.
- Choose "Deploy from a branch", select `main`, and set the folder to `/ (root)`.
- Save; GitHub Pages will publish the site from the repository root.

## Editing content
- Update `content.json` to change text, links, lists, or section order.
- The page reads this JSON at load and renders dynamically; no build step is required.
- Assets live in `assets/` (`style.css` and `main.js`); keep to system fonts and vanilla JS.

## Notes
- Features include dark mode with persistence, sticky navigation with scroll-spy, print-friendly styles, and accessible semantic structure.
- Inspired by academic CV information architecture; original implementation (no template copying).
