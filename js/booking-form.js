/**
 * booking-form.js
 *
 * Handles, in isolated sections below:
 *   1. Showing/hiding service-specific fields based on the selected service
 *   2. Showing/hiding the "Village name" field based on the selected area
 *   3. Stepper +/- buttons
 *   4. Front-end validation (custom messages, not browser popups — the
 *      form has novalidate for that reason)
 *   5. Swapping the form for the success state on a valid submit
 *
 * IMPORTANT — this is front-end only. There is no email/backend
 * integration yet. On a valid submit, this script only shows the local
 * success message; it does not send the booking anywhere. See the single
 * TODO block near the bottom for where that integration belongs later.
 */

(function () {
  const form = document.getElementById('booking-form');
  if (!form) return;

  const successEl = document.getElementById('booking-success');

  /* ----------------------------------------------------------------
     1. Service switching
  ---------------------------------------------------------------- */
  const serviceRadios = form.querySelectorAll('input[name="service"]');
  const serviceFieldBlocks = form.querySelectorAll('[data-service-fields]');

  function updateServiceFields() {
    const selected = form.querySelector('input[name="service"]:checked').value;
    serviceFieldBlocks.forEach((block) => {
      const appliesTo = block.dataset.serviceFields.split(',');
      block.hidden = !appliesTo.includes(selected);
    });
  }

  serviceRadios.forEach((radio) => radio.addEventListener('change', updateServiceFields));
  updateServiceFields();

  /* ----------------------------------------------------------------
     2. Village name conditional field
  ---------------------------------------------------------------- */
  const areaRadios = form.querySelectorAll('input[name="area"]');
  const villageField = form.querySelector('[data-village-field]');
  const villageInput = document.getElementById('village-name');

  function updateVillageField() {
    const selected = form.querySelector('input[name="area"]:checked').value;
    villageField.hidden = selected !== 'village';
  }

  areaRadios.forEach((radio) => radio.addEventListener('change', updateVillageField));
  updateVillageField();

  /* ----------------------------------------------------------------
     3. Steppers
  ---------------------------------------------------------------- */
  form.querySelectorAll('[data-stepper-increment], [data-stepper-decrement]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('aria-controls');
      const input = document.getElementById(targetId);
      const min = Number(input.min) || 0;
      const max = Number(input.max) || 9;
      const current = Number(input.value) || 0;
      const delta = btn.hasAttribute('data-stepper-increment') ? 1 : -1;
      const next = Math.min(max, Math.max(min, current + delta));
      input.value = next;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  /* ----------------------------------------------------------------
     4. Validation
  ---------------------------------------------------------------- */
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

  // Re-validate a single field as soon as the user interacts with it again,
  // so an error clears without needing to resubmit the whole form.
  function clearOnInteraction(input, errorId) {
    if (!input) return;
    input.addEventListener('input', () => markValid(input, errorId));
    input.addEventListener('change', () => markValid(input, errorId));
  }

  const customerNameInput = document.getElementById('customer-name');
  const phoneInput = document.getElementById('phone');
  const dateInput = document.getElementById('preferred-date');
  const addressInput = document.getElementById('address');

  clearOnInteraction(customerNameInput, 'error-customer-name');
  clearOnInteraction(phoneInput, 'error-phone');
  clearOnInteraction(dateInput, 'error-date');
  clearOnInteraction(addressInput, 'error-address');
  clearOnInteraction(villageInput, 'error-village-name');

  form.querySelectorAll('input[name="time"]').forEach((r) =>
    r.addEventListener('change', () => clearError('error-time'))
  );
  form.querySelectorAll('input[name="move_type"]').forEach((r) =>
    r.addEventListener('change', () => clearError('error-move-type'))
  );
  form.querySelectorAll('input[name="furnishing"]').forEach((r) =>
    r.addEventListener('change', () => clearError('error-furnishing'))
  );
  form
    .querySelectorAll(
      '[name="rooms_bedroom_mio"], [name="rooms_livingroom_mio"], [name="rooms_office_mio"], [name="rooms_bathroom_mio"]'
    )
    .forEach((input) => input.addEventListener('change', () => clearError('error-property-rooms')));

  function validate() {
    let firstInvalid = null;
    const selectedService = form.querySelector('input[name="service"]:checked').value;
    const selectedArea = form.querySelector('input[name="area"]:checked').value;

    // Full name
    if (!customerNameInput.value.trim()) {
      markInvalid(customerNameInput, 'error-customer-name', 'Please enter your name.');
      firstInvalid = firstInvalid || customerNameInput;
    } else {
      markValid(customerNameInput, 'error-customer-name');
    }

    // Phone — required, light length check rather than a strict pattern
    const phoneDigits = phoneInput.value.replace(/\D/g, '');
    if (!phoneInput.value.trim()) {
      markInvalid(phoneInput, 'error-phone', 'Please enter your phone number.');
      firstInvalid = firstInvalid || phoneInput;
    } else if (phoneDigits.length < 7) {
      markInvalid(phoneInput, 'error-phone', 'Please enter a valid phone number.');
      firstInvalid = firstInvalid || phoneInput;
    } else {
      markValid(phoneInput, 'error-phone');
    }

    // Date
    if (!dateInput.value) {
      markInvalid(dateInput, 'error-date', 'Please choose a date.');
      firstInvalid = firstInvalid || dateInput;
    } else {
      markValid(dateInput, 'error-date');
    }

    // Preferred time (radio group)
    const timeChecked = form.querySelector('input[name="time"]:checked');
    if (!timeChecked) {
      setError('error-time', 'Please choose a preferred time.');
      firstInvalid = firstInvalid || form.querySelector('input[name="time"]');
    } else {
      clearError('error-time');
    }

    // Address
    if (!addressInput.value.trim()) {
      markInvalid(addressInput, 'error-address', 'Please add your address or directions.');
      firstInvalid = firstInvalid || addressInput;
    } else {
      markValid(addressInput, 'error-address');
    }

    // Village name — only relevant if "Nearby village" is selected
    if (selectedArea === 'village' && !villageInput.value.trim()) {
      markInvalid(villageInput, 'error-village-name', 'Please enter the village name.');
      firstInvalid = firstInvalid || villageInput;
    } else {
      markValid(villageInput, 'error-village-name');
    }

    // Service-specific: Move-In/Move-Out
    if (selectedService === 'moving') {
      const moveTypeChecked = form.querySelector('input[name="move_type"]:checked');
      if (!moveTypeChecked) {
        setError('error-move-type', 'Please choose move-in or move-out.');
        firstInvalid = firstInvalid || form.querySelector('input[name="move_type"]');
      } else {
        clearError('error-move-type');
      }

      const furnishingChecked = form.querySelector('input[name="furnishing"]:checked');
      if (!furnishingChecked) {
        setError('error-furnishing', 'Please choose a furnishing status.');
        firstInvalid = firstInvalid || form.querySelector('input[name="furnishing"]');
      } else {
        clearError('error-furnishing');
      }

      const roomTotal = ['rooms_bedroom_mio', 'rooms_livingroom_mio', 'rooms_office_mio', 'rooms_bathroom_mio']
        .map((name) => Number(form.elements[name].value) || 0)
        .reduce((sum, n) => sum + n, 0);
      if (roomTotal === 0) {
        setError('error-property-rooms', 'Please add at least one room.');
        firstInvalid = firstInvalid || form.elements['rooms_bedroom_mio'];
      } else {
        clearError('error-property-rooms');
      }
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

    // TODO (future step, intentionally not built yet): send the booking
    // data to an email-delivery service here (e.g. Formspree/EmailJS).
    // For now, submitting only shows the local success message below —
    // nothing is sent anywhere.

    form.hidden = true;
    successEl.hidden = false;
    successEl.focus();
  });
})();
