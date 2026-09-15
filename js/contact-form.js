/**
 * contact-form.js
 *
 * Same front-end-only pattern as booking-form.js: custom validation
 * (novalidate on the form), inline errors, aria-invalid/aria-describedby,
 * and a local success state. No email/backend integration yet — see the
 * TODO block below for where that goes later.
 */

(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successEl = document.getElementById('contact-success');

  const nameInput = document.getElementById('contact-name');
  const phoneInput = document.getElementById('contact-phone');
  const messageInput = document.getElementById('contact-message');

  function setError(errorId, message) {
    const el = document.getElementById(errorId);
    if (el) el.textContent = message;
  }
  function clearError(errorId) {
    setError(errorId, '');
  }
  function markInvalid(input, errorId, message) {
    if (input) input.setAttribute('aria-invalid', 'true');
    setError(errorId, message);
  }
  function markValid(input, errorId) {
    if (input) input.removeAttribute('aria-invalid');
    clearError(errorId);
  }
  function clearOnInteraction(input, errorId) {
    if (!input) return;
    input.addEventListener('input', () => markValid(input, errorId));
    input.addEventListener('change', () => markValid(input, errorId));
  }

  clearOnInteraction(nameInput, 'error-contact-name');
  clearOnInteraction(phoneInput, 'error-contact-phone');
  clearOnInteraction(messageInput, 'error-contact-message');
  form.querySelectorAll('input[name="subject"]').forEach((r) =>
    r.addEventListener('change', () => clearError('error-subject'))
  );

  function validate() {
    let firstInvalid = null;

    if (!nameInput.value.trim()) {
      markInvalid(nameInput, 'error-contact-name', 'Please enter your name.');
      firstInvalid = firstInvalid || nameInput;
    } else {
      markValid(nameInput, 'error-contact-name');
    }

    const phoneDigits = phoneInput.value.replace(/\D/g, '');
    if (!phoneInput.value.trim()) {
      markInvalid(phoneInput, 'error-contact-phone', 'Please enter your phone number.');
      firstInvalid = firstInvalid || phoneInput;
    } else if (phoneDigits.length < 7) {
      markInvalid(phoneInput, 'error-contact-phone', 'Please enter a valid phone number.');
      firstInvalid = firstInvalid || phoneInput;
    } else {
      markValid(phoneInput, 'error-contact-phone');
    }

    const subjectChecked = form.querySelector('input[name="subject"]:checked');
    if (!subjectChecked) {
      setError('error-subject', 'Please choose a subject.');
      firstInvalid = firstInvalid || form.querySelector('input[name="subject"]');
    } else {
      clearError('error-subject');
    }

    if (!messageInput.value.trim()) {
      markInvalid(messageInput, 'error-contact-message', 'Please enter a message.');
      firstInvalid = firstInvalid || messageInput;
    } else {
      markValid(messageInput, 'error-contact-message');
    }

    return firstInvalid;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const firstInvalid = validate();

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // TODO (future step, intentionally not built yet): send this message
    // to an email-delivery service. For now, submitting only shows the
    // local success message — nothing is sent anywhere.

    form.hidden = true;
    successEl.hidden = false;
    successEl.focus();
  });
})();
