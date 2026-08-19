# Legend Websites

Portfolio &amp; landing site for Legend Websites — web design and development for local businesses.

Live at [legendwebsites.co.uk](https://www.legendwebsites.co.uk).

## Structure

- `website/` — static site (HTML/CSS/JS), served as Cloudflare Worker assets
- `worker.js` — asset-serving Worker, redirects apex → www
- `wrangler.jsonc` — deploy config, routes both `legendwebsites.co.uk` and `www.legendwebsites.co.uk`

## Portfolio

Cards link out to real, live projects: Vale Reflexology, Kingsland Barn, Brew Buddies, SnowBuddy, Square³, and the My Village Decor redesign concept. Private/internal repos (Square3 client dashboards excluded beyond the marketing site, Cryptobot, Tradeybot) are intentionally left out of the public showcase.

## Deploy

```
npx wrangler deploy
```
