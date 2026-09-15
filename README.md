# Safita Clean — Website

## Running this project locally

This site loads its shared header and footer dynamically (see `js/include.js`),
which uses `fetch()` to load `partials/header.html` and `partials/footer.html`.
Browsers block `fetch()` on files opened directly (`file:///...`), so **the
site must be served by a local development server** — it will not work if you
just double-click `index.html`.

**Option A — VS Code Live Server (recommended)**
1. Install the "Live Server" extension in VS Code.
2. Right-click `index.html` → "Open with Live Server".

**Option B — Python (already available on most machines)**
```
cd path/to/this/folder
python -m http.server 5500
```
Then open `http://localhost:5500` in your browser.

## Project structure

```
index.html, services.html, booking.html, about.html, contact.html
    → the five pages of the site

css/
    base.css        → colors, fonts, spacing, global reset
    layout.css       → header, footer, nav, containers, responsive rules
    components.css   → buttons, mobile menu button, small reusable pieces

js/
    include.js       → loads the shared header/footer into every page
    nav.js            → mobile menu open/close behavior
    main.js            → active nav link highlighting, footer year

partials/
    header.html       → shared nav bar, written once
    footer.html       → shared footer, written once

assets/               → images, logo, favicon (empty for now)
data/                 → will hold services.js (service list + pricing) — added
                         when we build the Services/Booking content
```

## Status

This is the **foundation only**: page shells, design tokens, header/footer,
and responsive/accessible base layout. No page content, service details,
pricing, or booking form logic has been built yet — that's the next step.
