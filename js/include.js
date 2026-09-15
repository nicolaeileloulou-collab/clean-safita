/**
 * include.js
 *
 * Finds every element with a `data-include="path/to/file.html"` attribute,
 * fetches that file, and drops its contents inside the element.
 * This is how the header and footer are written ONCE (in /partials) and
 * reused on all five pages.
 *
 * IMPORTANT: fetch() cannot load local files over the file:// protocol.
 * This site must be run through a local server, e.g. VS Code's
 * "Live Server" extension (right-click index.html -> "Open with Live Server"),
 * or `python -m http.server` from the project folder. See README.md.
 */

async function loadIncludes() {
  const includeNodes = document.querySelectorAll('[data-include]');

  const requests = Array.from(includeNodes).map(async (node) => {
    const path = node.getAttribute('data-include');
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load ${path}: ${response.status}`);
      }
      node.innerHTML = await response.text();
    } catch (error) {
      console.error(error);
      node.innerHTML =
        '<p style="padding:1rem;color:#a33;">' +
        'Unable to load this section. Make sure the site is running through ' +
        'a local server (e.g. VS Code Live Server), not opened directly as a file.' +
        '</p>';
    }
  });

  // Wait for header AND footer to finish loading before telling the rest
  // of the app it's safe to look for nav elements, etc.
  await Promise.all(requests);

  document.dispatchEvent(new Event('includes:loaded'));
}

document.addEventListener('DOMContentLoaded', loadIncludes);
