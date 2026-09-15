/**
 * faq-accordion.js
 *
 * Each FAQ question is an independent disclosure widget (button + panel),
 * not a tab-like "accordion" pattern — so plain <button> semantics are
 * already fully keyboard accessible (Tab, Enter, Space) with no custom
 * key handling needed.
 *
 * Only used on the Services page — this file isn't referenced from any
 * other page, since no other page has an FAQ yet.
 */

document.querySelectorAll('.faq-accordion__trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.faq-accordion__item');
    const isOpen = item.classList.contains('is-open');

    item.classList.toggle('is-open', !isOpen);
    trigger.setAttribute('aria-expanded', String(!isOpen));
  });
});
