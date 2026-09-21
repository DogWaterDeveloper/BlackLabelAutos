# Mark

The plate and the crown on their own, plus every size the browser and the operating system
ask for.

| File | Use |
| --- | --- |
| `mark-plate-gold.svg` | The plate. App icons, avatars, favicons above 20px, embroidery at 26mm or more |
| `mark-plate-knockout-gold.svg` | The plate with the crown **removed** as one even-odd path, so any ground shows through. Use on gold, on paper, on a photograph or on any brand colour |
| `mark-plate-white.svg` / `-black.svg` | One-colour grounds |
| `mark-plate-knockout-white.svg` / `-black.svg` | Knockout in a single ink |
| `crown-gold.svg` / `-white.svg` / `-black.svg` | The crown alone: watermarks, embossing, a stamp on packaging. Never in a menu or a table |
| `favicon-32.svg` | Browser tab at 24–48px |
| `favicon-16.svg` | 16–20px only. Valleys close to points, base band thickens |
| `appicon-1024.svg` | iOS/Android source: graphite ground, plate at 62% of the canvas |
| `*-2048.png` | Transparent 2048px exports of the plate, the knockout, the crown and the app icon |
| `mark-plate-gold-512.png`, `-180.png` | Touch-icon rasters at their functional sizes |
| `favicon-32-48.png`, `favicon-32-32.png`, `favicon-16-16.png` | Favicon rasters at their true sizes. Deliberately small, because a 2048px favicon is not a favicon |

## Geometry

The plate is a square whose corner radius is **one twelfth of its side**. Below 20px only
`favicon-16.svg` is used; above 20px the standard cut is correct.

## Inks

`mark-plate-gold.svg` is `gold-400` with a `graphite-950` crown. `mark-plate-black.svg` is
`graphite-950` with a `graphite-50` crown. `crown-*.svg` are single-ink: gold is `gold-400`,
white is `graphite-50`, black is `graphite-950`. Choose the file whose ink suits the ground, they cannot be recoloured in place.

## Rule

The crown is a brand mark, never a UI icon. For interface glyphs use `assets/Icons`.
