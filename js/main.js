/**
 * main.js
 *
 * Small setup tasks shared by every page. Also waits for "includes:loaded"
 * since it needs the injected header/footer to exist first.
 */

document.addEventListener('includes:loaded', () => {
  highlightCurrentPage();
  setFooterYear();
});

// Adds aria-current="page" to the nav link matching the page you're on,
// so the active link can be styled (see layout.css) and screen readers
// announce it correctly.
function highlightCurrentPage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.main-nav__list a').forEach((link) => {
    if (link.getAttribute('href') === currentPage) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

// Keeps the footer's copyright year correct without editing it by hand.
function setFooterYear() {
  const yearEl = document.querySelector('#current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
