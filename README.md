# Cave Talk

One-syllable clues only. Slip up, get bonked.

A word game for 2 or 3 teams, built as an installable phone app that works fully offline.

**Play:** https://oaks3000.github.io/cave-talk/

## Put it on your phone

- **iPhone / iPad (Safari):** open the link, tap Share, then **Add to Home Screen**.
- **Android (Chrome):** open the link, tap the menu, then **Install app** / **Add to Home screen**.

Open it once with a connection and it caches itself. After that it launches instantly with no signal at all.
When a new version is published, the app picks it up in the background and switches over the next
time you're on the setup screen (never mid-game).

## How to play

1. One player per team takes a turn as the Wordsmith: 60 seconds, one card at a time.
2. Get your team to say the word using **one-syllable words only**.
3. The other team(s) tap **Bonk!** the moment a multi-syllable word slips out: card lost, turn over.
4. **Correct** scores the card. 3 free **Skips** per turn, then each skip costs a point.
5. First team to the target score (10 / 15 / 20 / 30) wins.

Cards are worth 1-3 points depending on difficulty. The 1,500-card bank covers everyday objects, idioms,
countries, cities, famous people and school-level concepts.

## Players, teams and the leaderboard

- **Players are created once.** Tap **+ Players** under a team, type a name the first time, and from then on just tap them
  in the list. Names are unique ignoring case and spacing ("oak " is just Oak), so one person can't end up with two entries.
  A player can only be on one team per game.
- **Teams are saved automatically** when a game starts. Use **Saved teams** to fill a slot with a whole line-up in one tap.
- The people icon (setup screen only) lists everyone: rename to fix a typo, or delete.
- The trophy shows **team** and **individual** standings. The score is **games won**, not correct guesses; only finished
  games count, and every player on the winning team gets the win.

Everything is stored on the device, so an installed home-screen copy keeps its own history.

## Working on it

The repo root is exactly what GitHub Pages serves. Source lives in `src/`; `npm run build` regenerates the rest.

```
src/words.js            the word bank (edit this to add/remove cards)
src/store.js            roster, saved teams and win counts (pure functions + localStorage migration)
src/sheets.jsx          rules, player picker, saved teams, manage and leaderboard sheets
src/app.jsx             the game
src/icons.jsx           inline SVG icons
src/input.css           Tailwind entry + self-hosted font-faces + app-feel CSS
src/index.template.html page shell (meta tags, service-worker registration)
src/sw.template.js      offline service worker (versioned by a content hash at build time)
build.mjs               Babel + Tailwind + service worker + vendor/fonts copy
icons/                  app icon (icon.svg is the source; PNGs were rasterised from it)
manifest.webmanifest    install metadata
```

```
npm install
npm run build     # regenerates app.js, styles.css, index.html, sw.js, vendor/, fonts/
npm run serve     # http://localhost:8080 (service workers work on localhost)
```

Commit the generated files along with the source: Pages serves them as-is.

### Enabling GitHub Pages

Settings -> Pages -> **Build and deployment** -> Source: **GitHub Actions**.
`.github/workflows/pages.yml` then publishes the app on every push to `main`
(or run it by hand from the Actions tab: *Deploy to GitHub Pages* -> *Run workflow*).
