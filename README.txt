# Braj Seva 360 Website Prototype

## Files
- `index.html` — page structure and content
- `style.css` — colors, backgrounds, layout and responsive design
- `script.js` — interactions and brand name setting

## Run on your computer
1. Extract this ZIP into a folder.
2. Open the folder in VS Code.
3. Open `index.html` in your browser, or use the VS Code Live Server extension and click **Go Live**.
4. Internet is required for the Google Fonts and remote sample photos. The core page and interactions are local.

## Change the brand name later
Open `script.js` and edit the first setting:
```js
const BRAND_NAME = "Braj Seva 360";
```
Replace the text inside the quotation marks with the new name, save the file, and refresh the browser. The brand name in the header, footer and browser title will update automatically. The idea and other features stay the same.

## Important prototype notes
- This is a front-end concept prototype, not a deployed production platform.
- Sample listing cards and photos are illustrative; they are not verified businesses or live availability.
- Search filters work only on the included sample cards.
- The Smart Yatra planner makes general suggestions and does not provide live routes, crowd levels, opening hours or bookings.
- The interest form prepares an email draft on the user's device; it does not store information in a database or send it automatically.
- Before launch, replace demo content with verified data, connect a backend/database, add privacy and consent handling, and test with real users.
