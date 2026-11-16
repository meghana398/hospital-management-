/* ==========================================================
   Pharmacy portal scripts
   ========================================================== */

// Marks the clicked button as pressed and every other button in its group as not pressed.
function pressOnly(buttons, clicked) {
  buttons.forEach(function (button) {
    button.setAttribute('aria-pressed', button === clicked ? 'true' : 'false');
  });
}

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

// Prescriptions: the search box shows only the matching prescriptions.
// Each row carries data-search.
const rxSearch = document.querySelector('[data-rx-search]');
if (rxSearch) {
  rxSearch.addEventListener('input', function () {
    const text = rxSearch.value.trim().toLowerCase();
    let shown = 0;
    document.querySelectorAll('[data-rx-row]').forEach(function (row) {
      const matches = row.dataset.search.toLowerCase().includes(text);
      row.classList.toggle('hidden', !matches);
      if (matches) shown++;
    });
    document.querySelector('[data-no-rx]').hidden = shown > 0;
  });
}

// Dispense and bill: "View prescription" shows the prescription, search and cart;
// the same button then reads "Hide prescription" and hides them again.
const prescriptionToggle = document.querySelector('[data-toggle-prescription]');
if (prescriptionToggle) {
  const work = document.getElementById(prescriptionToggle.getAttribute('aria-controls'));
  const label = prescriptionToggle.querySelector('[data-toggle-label]');

  prescriptionToggle.addEventListener('click', function () {
    const open = prescriptionToggle.getAttribute('aria-expanded') === 'true';
    prescriptionToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
    work.hidden = open;
    label.textContent = open ? 'View prescription' : 'Hide prescription';
  });
}

// Inventory: the filter buttons and search box show only the matching batches.
// A button matches a row's data-flag (LOW, EXPIRING, EXPIRED) or data-type (MEDICINE, SUPPLY).
const inventoryFilters = document.querySelector('[data-inv-filters]');
if (inventoryFilters) {
  const inventoryButtons = inventoryFilters.querySelectorAll('[data-inv-filter]');
  const inventorySearch = inventoryFilters.querySelector('[data-inv-search]');

  function filterInventory() {
    const selected = inventoryFilters.querySelector('[data-inv-filter][aria-pressed="true"]').dataset.invFilter;
    const text = inventorySearch.value.trim().toLowerCase();
    let shown = 0;
    inventoryFilters.querySelectorAll('[data-inv-row]').forEach(function (row) {
      const matches = (selected === 'ALL' || row.dataset.flag === selected || row.dataset.type === selected)
        && row.dataset.search.toLowerCase().includes(text);
      row.classList.toggle('hidden', !matches);
      if (matches) shown++;
    });
    inventoryFilters.querySelector('[data-inv-count]').textContent = shown;
  }

  inventoryButtons.forEach(function (clicked) {
    clicked.addEventListener('click', function () {
      pressOnly(inventoryButtons, clicked);
      filterInventory();
    });
  });
  inventorySearch.addEventListener('input', filterInventory);
}

// Stock in and out: "All / Stock in / Stock out" shows only those register entries.
// Each row carries data-direction="IN" or "OUT".
const registerButtons = document.querySelectorAll('[data-register-filter]');
registerButtons.forEach(function (clicked) {
  clicked.addEventListener('click', function () {
    const selected = clicked.dataset.registerFilter;
    pressOnly(registerButtons, clicked);
    document.querySelectorAll('[data-register-row]').forEach(function (row) {
      row.classList.toggle('hidden', selected !== 'ALL' && row.dataset.direction !== selected);
    });
  });
});

// Purchase requests: ticking items updates "Request from admin · N";
// the button can be clicked only when at least one item is ticked.
// "Select all" ticks every item that is not already on a request.
const restockItems = document.querySelectorAll('[data-restock-item]');
if (restockItems.length) {
  const restockSend = document.querySelector('[data-restock-send]');

  function updateRestockCount() {
    const ticked = document.querySelectorAll('[data-restock-item]:checked').length;
    document.querySelector('[data-restock-count]').textContent = ticked;
    restockSend.disabled = ticked === 0;
  }

  restockItems.forEach(function (item) {
    item.addEventListener('change', updateRestockCount);
  });
  document.querySelector('[data-select-all]').addEventListener('click', function () {
    restockItems.forEach(function (item) {
      if (!item.disabled) item.checked = true;
    });
    updateRestockCount();
  });
}

// Accounts: "All / Money in / Money out" shows only those entries.
// Each entry carries data-direction="IN" or "OUT".
const entryButtons = document.querySelectorAll('[data-entry-filter]');
entryButtons.forEach(function (clicked) {
  clicked.addEventListener('click', function () {
    const selected = clicked.dataset.entryFilter;
    pressOnly(entryButtons, clicked);
    document.querySelectorAll('[data-entry]').forEach(function (row) {
      row.classList.toggle('hidden', selected !== 'ALL' && row.dataset.direction !== selected);
    });
  });
});