# Insect Smash (Browser Game)

Fast-paced arcade web game where you click/tap insects before they escape.

## Features

- 3 insect types with different speed/points (`fly`, `mosquito`, `ant`)
- Multiple movement patterns (straight, zig-zag, jitter)
- Combo multiplier and quick-reaction bonus scoring
- Progressive difficulty (spawn rate + speed + occasional multi-spawn)
- 3 lives, game over state, and 60-second session
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

## File Structure

- `index.html` - screens + canvas + HUD layout
- `styles.css` - responsive UI styling
- `script.js` - game loop, entities, scoring, difficulty, rendering, audio

# AntKiller

# AntKiller
