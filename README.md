# Aposonía — Interactive Sound Map

Sound art project by **Gaetano Cappella** investigating underwater acoustic pollution in Thermaikos Gulf, Thessaloniki, Greece.

## About

*Aposonía* (from Greek: absence of sound) uses hydrophone field recordings and spatial audio composition to employ the human fight-or-flight response in generating interspecies empathy with marine organisms subjected to chronic anthropogenic noise.

The interactive map presents five listening stations across the Thermaikos Gulf, each documenting a distinct acoustic environment affected by port activity, industrial noise, and maritime traffic.

## Features

- Interactive Leaflet.js map centred on Thermaikos Gulf (40.6264°N, 22.9400°E)
- Five numbered listening stations with field recordings and metadata
- Four languages: English, Italian, Spanish, Greek — switchable with localStorage persistence
- Animated ambient canvas (wave simulation)
- Museum-grade design system: Cormorant Garamond / Georgia / IBM Plex Mono

## File Structure

```
aposonia-map/
├── index.html            # Main page
├── translations.json     # EN / IT / ES / EL content
├── css/
│   └── museum.css        # Full design system
├── js/
│   ├── lang.js           # Language controller
│   ├── map.js            # Leaflet map + station panels
│   └── ambient.js        # Canvas wave animation
└── data/                 # Field recordings (not included in repo)
```

## Listening Stations

| # | Name | Coordinates | Depth |
|---|------|-------------|-------|
| 1 | Port Entrance | 40°37'54"N 22°56'17"E | 12 m |
| 2 | Northern Shallows | 40°39'07"N 22°54'54"E | 8 m |
| 3 | Central Gulf | 40°36'36"N 22°58'12"E | 18 m |
| 4 | Southern Passage | 40°35'20"N 22°59'42"E | 22 m |
| 5 | Eastern Inlet | 40°37'35"N 23°00'36"E | 6 m |

## Deploy

Hosted via GitHub Pages. Workflow: `.github/workflows/deploy.yml`  
Triggers automatically on push to `main`.

## Support

Developed during a residency supported by **Culture Moves Europe**  
Creative Europe Programme / Goethe-Institut

---

© Gaetano Cappella
