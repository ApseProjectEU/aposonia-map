# Aposonía Map

An interactive web map showcasing soundscapes from South Europe.

## Live Demo

[https://soundscapesofsoutheurope.github.io/aposonia-map](https://soundscapesofsoutheurope.github.io/aposonia-map)

## Project Structure

```
aposonia-map/
├── index.html              # Main entry point
├── css/
│   └── style.css           # Application styles
├── js/
│   ├── map.js              # Leaflet map & marker logic
│   ├── ui.js               # Player panel & filter UI
│   └── main.js             # App initialisation
├── data/
│   ├── points.json         # Soundscape locations & metadata
│   └── points-example.json # Minimal example dataset
└── README.md
```

## Adding Soundscapes

Edit `data/points.json`. Each entry follows this schema:

```json
{
  "id": "xx-001",
  "title": "Soundscape title",
  "location": "City or area name",
  "country": "Country name",
  "lat": 00.0000,
  "lng": 00.0000,
  "category": "nature | urban | cultural | water",
  "description": "Short description of the recording.",
  "audio": "path/to/audio.mp3"
}
```

## Running Locally

Serve the project with any static file server, e.g.:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

## Deploying to GitHub Pages

1. Go to **Settings > Pages** in the repository.
2. Set **Source** to the `main` branch, folder `/`.
3. Save and wait 1–2 minutes.
4. Your map will be live at `https://soundscapesofsoutheurope.github.io/aposonia-map`.

## Technologies

- [Leaflet.js](https://leafletjs.com/) – interactive maps
- [OpenStreetMap](https://www.openstreetmap.org/) – tile layer
- Vanilla HTML / CSS / JavaScript – no build step required

## License

MIT
