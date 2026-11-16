/* ==========================================================
   Diagnostics portal scripts
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

// Test requests: the status buttons, department buttons and search box show only the matching orders.
// Each order carries data-status, data-departments ("LAB RADIOLOGY") and data-search.
const requestFilters = document.querySelector('[data-request-filters]');
if (requestFilters) {
  const statusButtons = requestFilters.querySelectorAll('[data-status-filter]');
  const departmentButtons = requestFilters.querySelectorAll('[data-department-filter]');
  const searchInput = requestFilters.querySelector('[data-request-search]');

  function pressedValue(buttons, key) {
    let value = 'ALL';
    buttons.forEach(function (button) {
      if (button.getAttribute('aria-pressed') === 'true') value = button.dataset[key];
    });
    return value;
  }

  function filterRequests() {
    const status = pressedValue(statusButtons, 'statusFilter');
    const department = pressedValue(departmentButtons, 'departmentFilter');
    const text = searchInput.value.trim().toLowerCase();
    let shown = 0;

    document.querySelectorAll('[data-request]').forEach(function (order) {
      const matches = (status === 'ALL' || order.dataset.status === status)
        && (department === 'ALL' || order.dataset.departments.split(' ').includes(department))
        && order.dataset.search.toLowerCase().includes(text);
      order.classList.toggle('hidden', !matches);
      if (matches) shown++;
    });

    document.querySelector('[data-no-requests]').hidden = shown > 0;
  }

  [statusButtons, departmentButtons].forEach(function (buttons) {
    buttons.forEach(function (clicked) {
      clicked.addEventListener('click', function () {
        buttons.forEach(function (button) {
          button.setAttribute('aria-pressed', button === clicked ? 'true' : 'false');
        });
        filterRequests();
      });
    });
  });
  searchInput.addEventListener('input', filterRequests);
}

// Worklist: the department buttons show only the cards of that department.
// Each card carries data-department="LAB" / "RADIOLOGY" / "CARDIOLOGY".
const worklistFilters = document.querySelectorAll('[data-worklist-filter]');
worklistFilters.forEach(function (clicked) {
  clicked.addEventListener('click', function () {
    const selected = clicked.dataset.worklistFilter;
    worklistFilters.forEach(function (button) {
      button.setAttribute('aria-pressed', button === clicked ? 'true' : 'false');
    });
    document.querySelectorAll('[data-worklist-card]').forEach(function (card) {
      card.classList.toggle('hidden', selected !== 'ALL' && card.dataset.department !== selected);
    });
  });
});

// Reports and history: the status tabs, search box and department dropdown show only the matching rows.
// Each row carries data-status, data-department and data-search.
const historyList = document.querySelector('[data-history]');
if (historyList) {
  const historyTabs = historyList.querySelectorAll('[data-history-tab]');
  const historySearch = historyList.querySelector('[data-history-search]');
  const historyDepartment = historyList.querySelector('[data-history-department]');

  function filterHistory() {
    const pressedTab = historyList.querySelector('[data-history-tab][aria-pressed="true"]');
    const status = pressedTab ? pressedTab.dataset.historyTab : 'ALL';
    const text = historySearch.value.trim().toLowerCase();
    const department = historyDepartment.value;
    let shown = 0;

    historyList.querySelectorAll('[data-history-row]').forEach(function (row) {
      const matches = (status === 'ALL' || row.dataset.status === status)
        && (!department || row.dataset.department === department)
        && row.dataset.search.toLowerCase().includes(text);
      row.classList.toggle('hidden', !matches);
      if (matches) shown++;
    });

    historyList.querySelector('[data-history-count]').textContent = shown;
  }

  historyTabs.forEach(function (clicked) {
    clicked.addEventListener('click', function () {
      historyTabs.forEach(function (tab) {
        tab.setAttribute('aria-pressed', tab === clicked ? 'true' : 'false');
      });
      filterHistory();
    });
  });
  historySearch.addEventListener('input', filterHistory);
  historyDepartment.addEventListener('change', filterHistory);
}

// Marks the clicked button as pressed and every other button in its group as not pressed.
// Used by the filter buttons below.
function pressOnly(buttons, clicked) {
  buttons.forEach(function (button) {
    button.setAttribute('aria-pressed', button === clicked ? 'true' : 'false');
  });
}

// Test catalogue: the search box and category buttons show only the matching tests.
// Each row carries data-category and data-search.
const catalogueFilters = document.querySelector('[data-catalogue-filters]');
if (catalogueFilters) {
  const categoryButtons = catalogueFilters.querySelectorAll('[data-catalogue-filter]');
  const catalogueSearch = catalogueFilters.querySelector('[data-catalogue-search]');

  function filterCatalogue() {
    const category = catalogueFilters.querySelector('[data-catalogue-filter][aria-pressed="true"]').dataset.catalogueFilter;
    const text = catalogueSearch.value.trim().toLowerCase();
    document.querySelectorAll('[data-catalogue-row]').forEach(function (row) {
      const matches = (category === 'ALL' || row.dataset.category === category)
        && row.dataset.search.toLowerCase().includes(text);
      row.classList.toggle('hidden', !matches);
    });
  }

  categoryButtons.forEach(function (clicked) {
    clicked.addEventListener('click', function () {
      pressOnly(categoryButtons, clicked);
      filterCatalogue();
    });
  });
  catalogueSearch.addEventListener('input', filterCatalogue);
}

// Test billing: the search box and filter buttons show only the matching bills.
// A button's data-bill-filter can list several statuses, e.g. "INSURANCE SCHEME".
const billFilters = document.querySelector('[data-bill-filters]');
if (billFilters) {
  const billButtons = billFilters.querySelectorAll('[data-bill-filter]');
  const billSearch = billFilters.querySelector('[data-bill-search]');

  function filterBills() {
    const statuses = billFilters.querySelector('[data-bill-filter][aria-pressed="true"]').dataset.billFilter.split(' ');
    const text = billSearch.value.trim().toLowerCase();
    let shown = 0;
    billFilters.querySelectorAll('[data-bill]').forEach(function (bill) {
      const matches = (statuses.includes('ALL') || statuses.includes(bill.dataset.status))
        && bill.dataset.search.toLowerCase().includes(text);
      bill.classList.toggle('hidden', !matches);
      if (matches) shown++;
    });
    billFilters.querySelector('[data-no-bills]').hidden = shown > 0;
  }

  billButtons.forEach(function (clicked) {
    clicked.addEventListener('click', function () {
      pressOnly(billButtons, clicked);
      filterBills();
    });
  });
  billSearch.addEventListener('input', filterBills);
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

// Inventory: the search box, type buttons and status buttons show only the matching items.
// Each row carries data-type, data-status and data-search.
const stockFilters = document.querySelector('[data-stock-filters]');
if (stockFilters) {
  const typeButtons = stockFilters.querySelectorAll('[data-stock-type]');
  const stockStatusButtons = stockFilters.querySelectorAll('[data-stock-status]');
  const stockSearch = stockFilters.querySelector('[data-stock-search]');

  function filterStock() {
    const type = stockFilters.querySelector('[data-stock-type][aria-pressed="true"]').dataset.stockType;
    const status = stockFilters.querySelector('[data-stock-status][aria-pressed="true"]').dataset.stockStatus;
    const text = stockSearch.value.trim().toLowerCase();
    stockFilters.querySelectorAll('[data-stock-row]').forEach(function (row) {
      const matches = (type === 'ALL' || row.dataset.type === type)
        && (status === 'ALL' || row.dataset.status === status)
        && row.dataset.search.toLowerCase().includes(text);
      row.classList.toggle('hidden', !matches);
    });
  }

  [typeButtons, stockStatusButtons].forEach(function (buttons) {
    buttons.forEach(function (clicked) {
      clicked.addEventListener('click', function () {
        pressOnly(buttons, clicked);
        filterStock();
      });
    });
  });
  stockSearch.addEventListener('input', filterStock);
}

// Pharmacy requests: ticking items updates "Request from pharmacy · N";
// the button can be clicked only when at least one item is ticked. "Select all" ticks every item.
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
      item.checked = true;
    });
    updateRestockCount();
  });
}