/**
 * services-showcase.js
 *
 * The service selector, image, and details panel behave as a proper ARIA
 * "tabs" widget (role="tablist"/"tab"/"tabpanel"):
 *   - Click or tap a tab -> selects it (persists).
 *   - Arrow Up/Down (or Left/Right) moves focus AND selects — the
 *     standard "automatic activation" tabs pattern.
 *   - Home/End jump to the first/last tab.
 *   - Hovering a tab (desktop, real pointers only) PREVIEWS that
 *     service's image/details without changing the actual selection —
 *     moving the mouse away reverts to whatever is actually selected.
 *
 * Hover-preview is only wired up on devices that report genuine hover
 * support, so touch/tablet devices never get stuck in a "hovering" state.
 */

(function () {
  const root = document.getElementById('services-showcase');
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll('.showcase__tab'));
  const supportsHover = window.matchMedia('(hover: hover)').matches;

  function show(service) {
    root.querySelectorAll('.showcase__image').forEach((el) => {
      const isMatch = el.dataset.image === service;
      el.classList.toggle('is-active', isMatch);
      el.setAttribute('aria-hidden', String(!isMatch));
    });
    root.querySelectorAll('.showcase__panel').forEach((el) => {
      el.classList.toggle('is-active', el.id === `panel-${service}`);
    });
  }

  function getSelected() {
    const selectedTab = tabs.find((t) => t.classList.contains('is-selected'));
    return selectedTab ? selectedTab.dataset.service : tabs[0].dataset.service;
  }

  function select(service, { moveFocus } = {}) {
    tabs.forEach((tab) => {
      const isMatch = tab.dataset.service === service;
      tab.classList.toggle('is-selected', isMatch);
      tab.setAttribute('aria-selected', String(isMatch));
      tab.tabIndex = isMatch ? 0 : -1;
      if (isMatch && moveFocus) tab.focus();
    });
    show(service);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab.dataset.service));

    if (supportsHover) {
      tab.addEventListener('mouseenter', () => show(tab.dataset.service));
    }

    tab.addEventListener('keydown', (event) => {
      let targetIndex = null;

      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        targetIndex = (index + 1) % tabs.length;
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        targetIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === 'Home') {
        targetIndex = 0;
      } else if (event.key === 'End') {
        targetIndex = tabs.length - 1;
      }

      if (targetIndex !== null) {
        event.preventDefault();
        select(tabs[targetIndex].dataset.service, { moveFocus: true });
      }
    });
  });

  if (supportsHover) {
    root.querySelector('.showcase__tabs').addEventListener('mouseleave', () => {
      show(getSelected());
    });
  }
})();
