# Unified University Rankings

A ranking-only web app that aggregates university positions across:

- Times Higher Education (THE)
- QS World University Rankings
- ShanghaiRanking (ARWU)

No events/products/services pages are included; this project focuses only on rankings comparison.

## Features

- Unified table with `University`, `Country`, `Region`, `THE`, `QS`, `ARWU`, and average rank
- Simulated Top 100 universities with Top 100 ranks per provider
- Sort any table column
- Filter by country, region, rank range, and provider view (All / THE / QS / ARWU)
- Global search (university name or country)
- Pagination for large datasets
- Compare tool (2 to 5 universities)
- University profile route (`/university/:id`) with provider-specific score breakdown fields

## Data

The app includes a 100-entry simulated dataset in `script.js` with:

- THE rank + metric breakdown (`teaching`, `research`, `citations`, `internationalOutlook`)
- QS rank + metric breakdown (`academicReputation`, `employerReputation`, `facultyStudent`, `citationsPerFaculty`, `internationalFaculty`, `internationalStudents`)
- ARWU rank + metric breakdown (`alumni`, `award`, `hici`, `ns`, `pub`, `pcp`)

## Run Locally

Open `index.html` directly, or run a static server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy (Vercel)

1. Import this repository into Vercel.
2. Framework Preset: `Other`.
3. Build Command: leave empty.
4. Output Directory: `.`.
5. Deploy.

`vercel.json` already includes a rewrite so `/university/:id` routes back to `index.html`.

## Deployment Link

- Public URL: `https://justinsecurities-bit.github.io/AntKiller/`
- Repository: `https://github.com/justinsecurities-bit/AntKiller`

## File Structure

- `index.html` - app layout and sections
- `styles.css` - responsive dashboard styling
- `script.js` - dataset + filtering/sorting/pagination/compare logic
