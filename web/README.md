# SofaSpark HTML prototype

**Public browser preview:** https://sofaspark-party-preview.vercel.app

This static web app is for reviewing the UX before final Roku production release. It uses the **same 432 cards** as `../source/decks.brs` (in `decks.js`) and mirrors four modes, all three audience packs, countdowns, two-team scoring, and remote-style keyboard navigation. It does **not** ship a different Roku app or process money.

### Open locally

Run a static HTTP server from `web/`:

```bash
cd web
python -m http.server 8000
```

Visit http://localhost:8000, then try the app on a phone or in desktop DevTools. No backend, API key or accounts are required. After first HTTPS visit, the service worker caches the local app scripts and cards for offline repeat visits.

### Design lab

Click **Design lab** in the top right to try Midnight, Citrus, and Ocean palettes, 80–130% card text size, and desktop/mobile preview widths. Settings are browser-local and do not modify the Roku code automatically.

### Keys

- **Home / packs**: Left and Right to move between options, Enter to select
- **Game**: Right / Enter for next card; Left for previous card
- **Game**: Space to start/pause timer; Up for Sun +1; Down for Moon +1
- **All screens**: Escape / Backspace to go back

The browser layout is a visual design experiment; **the current Roku SceneGraph source is not yet styled to match it pixel-for-pixel.** After you approve a design, port the chosen UI to `../components/MainScene.xml` and `../components/MainScene.brs` before publishing.

Changes to `web/` on `main` automatically deploy through the connected Vercel project `sofaspark-party-preview`.
