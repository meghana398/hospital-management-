/* ==========================================================
   Doctor portal scripts
   ========================================================== */

// Apply for leave: "Leave" / "Permission, a few hours" switch.
// Fields carry data-request-types="LEAVE" or "PERMISSION".
const requestTypeRadios = document.querySelectorAll('input[name="requestType"]');
if (requestTypeRadios.length) {
  function showRequestFields() {
    const selected = document.querySelector('input[name="requestType"]:checked').value;
    document.querySelectorAll('[data-request-types]').forEach(function (field) {
      field.hidden = !field.dataset.requestTypes.split(' ').includes(selected);
    });
  }

  requestTypeRadios.forEach(function (radio) {
    radio.addEventListener('change', showRequestFields);
  });
  showRequestFields();
}

// Notifications: filter buttons show only the notifications of that category.
// Each notification carries data-notification-category="ARRIVAL" / "BOOKING" / "CHANGE" / "REPORT".
const notificationFilters = document.querySelectorAll('[data-notification-filter]');
if (notificationFilters.length) {
  notificationFilters.forEach(function (filterButton) {
    filterButton.addEventListener('click', function () {
      const selected = filterButton.dataset.notificationFilter;

      notificationFilters.forEach(function (button) {
        button.setAttribute('aria-pressed', button === filterButton ? 'true' : 'false');
      });

      document.querySelectorAll('[data-notification-category]').forEach(function (item) {
        const matches = selected === 'ALL' || item.dataset.notificationCategory === selected;
        item.classList.toggle('hidden', !matches);
      });
    });
  });
}

// Notifications: "Mark as read" removes that notification's "New" label;
// "Mark all as read" does it for every notification.
document.querySelectorAll('[data-mark-read]').forEach(function (button) {
  button.addEventListener('click', function () {
    const item = button.closest('[data-notification-category]');
    item.querySelectorAll('[data-new-badge], [data-mark-read]').forEach(function (element) {
      element.classList.add('hidden');
    });
  });
});

const markAllReadButton = document.getElementById('mark-all-read');
if (markAllReadButton) {
  markAllReadButton.addEventListener('click', function () {
    document.querySelectorAll('[data-new-badge], [data-mark-read]').forEach(function (element) {
      element.classList.add('hidden');
    });
  });
}

// Consultation: allergy fields show only when "Has allergies" is selected
const allergyStatusRadios = document.querySelectorAll('input[name="allergyStatus"]');
if (allergyStatusRadios.length) {
  function showAllergyFields() {
    const selected = document.querySelector('input[name="allergyStatus"]:checked').value;
    document.querySelector('[data-allergy-fields]').hidden = selected !== 'HAS_ALLERGIES';
  }

  allergyStatusRadios.forEach(function (radio) {
    radio.addEventListener('change', showAllergyFields);
  });
  showAllergyFields();
}

// Consultation: BMI is worked out from weight (kg) and height (cm)
const weightInput = document.getElementById('vital-weight');
const heightInput = document.getElementById('vital-height');
if (weightInput && heightInput) {
  function updateBmi() {
    const weight = parseFloat(weightInput.value);
    const heightInMetres = parseFloat(heightInput.value) / 100;
    document.getElementById('vital-bmi').value =
      weight > 0 && heightInMetres > 0 ? (weight / (heightInMetres * heightInMetres)).toFixed(1) : '';
  }

  weightInput.addEventListener('input', updateBmi);
  heightInput.addEventListener('input', updateBmi);
  updateBmi();
}

// Consultation: diagnosis and tests are shown as chips.
// A form with data-chip-form="list-id" adds a chip to that list; × removes it.
// "Common" buttons (data-quick-chip) add a chip straight away.
function addChip(list, text, badge) {
  const alreadyAdded = Array.from(list.querySelectorAll('[data-chip-text]')).some(function (chipText) {
    return chipText.textContent.toLowerCase() === text.toLowerCase();
  });
  if (alreadyAdded) return;

  const chip = document.createElement('li');
  chip.dataset.chip = '';
  chip.className = 'inline-flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-md border border-[#cfe0ee] bg-[#e7f0f8] text-[15px] font-medium text-[#245d85]';
  chip.innerHTML =
    '<span data-chip-text></span>' +
    '<span class="px-1.5 py-0.5 rounded border border-[#cfe0ee] bg-white text-xs font-medium text-ink"></span>' +
    '<button type="button" data-remove-chip class="w-6 h-6 grid place-items-center rounded text-subtle hover:text-ink">' +
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
    '</button>';
  chip.children[0].textContent = text;
  chip.children[1].textContent = badge;
  chip.children[2].setAttribute('aria-label', 'Remove ' + text);
  list.appendChild(chip);
}

document.querySelectorAll('[data-chip-list]').forEach(function (list) {
  list.addEventListener('click', function (event) {
    const removeButton = event.target.closest('[data-remove-chip]');
    if (removeButton) removeButton.closest('[data-chip]').remove();
  });
});

document.querySelectorAll('[data-chip-form]').forEach(function (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const input = form.querySelector('[data-chip-input]');
    const text = input.value.trim();
    if (!text) return;
    const badgeSelect = form.querySelector('[data-chip-badge-select]');
    addChip(document.getElementById(form.dataset.chipForm), text, badgeSelect.selectedOptions[0].textContent);
    input.value = '';
    input.focus();
  });
});

document.querySelectorAll('[data-quick-chip]').forEach(function (button) {
  button.addEventListener('click', function () {
    addChip(document.getElementById(button.dataset.chipTarget), button.dataset.quickChip, button.dataset.chipBadge);
  });
});

// Consultation: "+ Add medicine" adds an empty prescription row; the bin removes a row
const rxRows = document.querySelector('[data-rx-rows]');
if (rxRows) {
  document.querySelector('[data-add-rx]').addEventListener('click', function () {
    const newRow = document.getElementById('rx-row-template').content.firstElementChild.cloneNode(true);
    rxRows.appendChild(newRow);
    newRow.querySelector('input').focus();
  });

  rxRows.addEventListener('click', function (event) {
    const removeButton = event.target.closest('[data-remove-rx]');
    if (removeButton) removeButton.closest('[data-rx-row]').remove();
  });
}

// Appointments and My patients: the search box and dropdowns show only the matching rows.
// Rows carry data-search="..." plus one data-* value per dropdown (data-filter-field names it).
// A dropdown with data-filter-mode="max" keeps rows whose value is at most the chosen number.
document.querySelectorAll('[data-table-filter]').forEach(function (filterBox) {
  const rows = document.querySelectorAll('[data-filter-row]');
  const count = document.querySelector('[data-filter-count]');

  function filterRows() {
    const text = filterBox.querySelector('[data-filter-text]').value.trim().toLowerCase();
    let shown = 0;

    rows.forEach(function (row) {
      let matches = row.dataset.search.toLowerCase().includes(text);

      filterBox.querySelectorAll('select[data-filter-field]').forEach(function (select) {
        if (!select.value) return;
        const rowValue = row.dataset[select.dataset.filterField];
        if (select.dataset.filterMode === 'max') {
          matches = matches && Number(rowValue) <= Number(select.value);
        } else {
          matches = matches && rowValue === select.value;
        }
      });

      row.classList.toggle('hidden', !matches);
      if (matches) shown++;
    });

    if (count) count.textContent = shown;
  }

  filterBox.addEventListener('input', filterRows);
  filterBox.addEventListener('change', filterRows);
});

// Patient history: "Download summary" opens the browser's print dialog (save as PDF from there)
document.querySelectorAll('[data-print]').forEach(function (button) {
  button.addEventListener('click', function () {
    window.print();
  });
});

// Reports to review: "Surgery needed" shows the surgery fields for that report
// and swaps the send button for "Send to front desk · surgery required".
document.querySelectorAll('[data-report-card]').forEach(function (card) {
  const surgeryRadios = card.querySelectorAll('input[name^="surgeryNeeded"]');

  function showSurgeryFields() {
    const surgeryNeeded = card.querySelector('input[name^="surgeryNeeded"]:checked').value === 'YES';
    card.querySelector('[data-surgery-fields]').hidden = !surgeryNeeded;
    card.querySelector('[data-send-normal]').classList.toggle('hidden', surgeryNeeded);
    card.querySelector('[data-send-surgery]').classList.toggle('hidden', !surgeryNeeded);
  }

  surgeryRadios.forEach(function (radio) {
    radio.addEventListener('change', showSurgeryFields);
  });
  showSurgeryFields();
});

// My schedule: "Block" closes a free slot to bookings; "Unblock" opens it again
document.querySelectorAll('[data-block-slot]').forEach(function (button) {
  button.addEventListener('click', function () {
    const slot = button.closest('[data-slot]');
    const status = slot.querySelector('[data-slot-status]');
    const text = slot.querySelector('[data-slot-text]');
    const blocking = button.textContent.trim() === 'Block';

    status.textContent = blocking ? 'Blocked' : 'Free';
    status.className = blocking
      ? 'pill border border-slate-300 bg-slate-200 text-slate-600'
      : 'pill border border-dashed border-slate-300 bg-white text-slate-500';
    text.textContent = blocking ? 'Blocked by you' : 'Open for booking';
    button.textContent = blocking ? 'Unblock' : 'Block';
  });
});

// My schedule: "Block day" adds the chosen date to the leave and blocked days list
const blockDayForm = document.getElementById('block-day-form');
if (blockDayForm) {
  blockDayForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const dateValue = document.getElementById('block-date').value;
    if (!dateValue) return;

    const date = new Date(dateValue + 'T00:00:00');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const reason = document.getElementById('block-reason').selectedOptions[0].textContent;

    const item = document.createElement('li');
    item.className = 'p-4 rounded-lg border border-[#e3eaef] bg-[#f8fafc]';
    item.innerHTML = '<p class="text-[15px] font-semibold text-ink"></p><p class="mt-0.5 text-sm text-subtle"></p>';
    item.children[0].textContent = days[date.getDay()] + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear() + ' · full day';
    item.children[1].textContent = reason;
    document.getElementById('blocked-days').appendChild(item);
    blockDayForm.reset();
  });
}