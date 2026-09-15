/**
 * nav.js
 *
 * Mobile menu open/close behavior.
 *
 * This waits for the "includes:loaded" event (fired by include.js) instead
 * of running immediately, because the nav bar itself is injected into the
 * page dynamically — it doesn't exist yet when this file first runs.
 */

document.addEventListener('includes:loaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (!toggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  };

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close the menu once a link is chosen, so it doesn't stay open
  // after navigating to the next page.
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape, for keyboard users.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
});
