# Insect Smash (Browser Game)

Fast-paced arcade web game where you click/tap insects before they escape.

## About

Insect Smash is a lightweight arcade browser game focused on quick reflexes and short play sessions.
You have 30 seconds to smash as many insects as possible by clicking (desktop) or tapping (mobile).
The game is designed to be simple, responsive, and fun, with animated feedback, score tracking, and increasing challenge over time.

## Live Demo

GitHub Pages URL (after enabling Pages in repository settings):

- https://justinsecurities-bit.github.io/AntKiller/

## Deployment Link

- Public game: https://justinsecurities-bit.github.io/AntKiller/
- Repository: https://github.com/justinsecurities-bit/AntKiller

## Screenshot

![Insect Smash gameplay screenshot](./assets/insect-smash-screenshot.svg)

## Features

- 3 insect types with different speed/points (`fly`, `mosquito`, `ant`)
- Multiple movement patterns (straight, zig-zag, jitter)
- Point system: score is the number of insects smashed in one round
- Combo tracking for streak feedback
- Progressive difficulty (spawn rate + speed + occasional multi-spawn)
- 30-second game session
- Start, gameplay, and game-over screens
- Floating score text and particle feedback
- Light synth audio for hit/miss/game-over and looping background theme
- Local high score persistence with `localStorage`
- Mouse + touch controls (desktop/mobile)

## Run Locally

Because many browsers restrict module/media behavior on `file://`, use a local static server:

### Option A: VS Code / Cursor Live Server

1. Open project folder.
2. Start Live Server on `index.html`.

### Option B: Python

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy

This project is static and deploys directly to:

- Vercel
- Netlify
- GitHub Pages

### GitHub Pages Setup (one-time)

1. Open repository settings: `Settings -> Pages`.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push any commit to `main` (or re-run the `Deploy static content to Pages` workflow in Actions).
4. Your public game URL will be:
   - `https://justinsecurities-bit.github.io/AntKiller/`

## File Structure

- `index.html` - screens + canvas + HUD layout
- `styles.css` - responsive UI styling
- `script.js` - game loop, entities, scoring, difficulty, rendering, audio
