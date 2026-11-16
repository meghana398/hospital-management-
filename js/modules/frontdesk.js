/* ==========================================================
   Frontdesk portal scripts
   ========================================================== */

// Patient verification: CLEAR button empties the Aadhaar / UHID field
const clearIdButton = document.getElementById('clear-patient-id');
if (clearIdButton) {
  clearIdButton.addEventListener('click', function () {
    const input = document.getElementById('patient-id');
    input.value = '';
    input.focus();
  });
}

// Verify OTP: move between the 6 boxes as digits are typed, deleted or pasted
const otpBoxes = document.querySelectorAll('[data-otp] input');
if (otpBoxes.length) {
  otpBoxes.forEach(function (box, index) {
    box.addEventListener('input', function () {
      box.value = box.value.replace(/\D/g, '').slice(-1);
      if (box.value && index < otpBoxes.length - 1) {
        otpBoxes[index + 1].focus();
      }
    });

    box.addEventListener('keydown', function (event) {
      if (event.key === 'Backspace' && !box.value && index > 0) {
        otpBoxes[index - 1].focus();
      }
    });

    box.addEventListener('paste', function (event) {
      const digits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, otpBoxes.length);
      if (!digits) return;
      event.preventDefault();
      digits.split('').forEach(function (digit, i) {
        otpBoxes[i].value = digit;
      });
      otpBoxes[digits.length - 1].focus();
    });
  });
}

// Verify OTP: resend countdown. "Resend OTP" becomes a link when it reaches 0:00.
const resendTimer = document.getElementById('resend-timer');
if (resendTimer) {
  const resendLink = document.getElementById('resend-otp');
  let secondsLeft = parseInt(resendTimer.dataset.seconds, 10);

  const countdown = setInterval(function () {
    secondsLeft--;
    resendTimer.textContent = Math.floor(secondsLeft / 60) + ':' + String(secondsLeft % 60).padStart(2, '0');

    if (secondsLeft <= 0) {
      clearInterval(countdown);
      document.getElementById('resend-message').textContent = "Didn't get it? You can resend it now.";
      resendLink.removeAttribute('aria-disabled');
      resendLink.href = 'verify-otp.html';
    }
  }, 1000);
}

// Patient registration: work out age (years and months) from date of birth
const dobInput = document.getElementById('dob');
if (dobInput) {
  const ageYears = document.getElementById('age-years');
  const ageMonths = document.getElementById('age-months');

  function updateAge() {
    if (!dobInput.value) {
      ageYears.value = '';
      ageMonths.value = '';
      return;
    }
    const dob = new Date(dobInput.value);
    const today = new Date();
    let months = (today.getFullYear() - dob.getFullYear()) * 12 + (today.getMonth() - dob.getMonth());
    if (today.getDate() < dob.getDate()) months--;
    if (months < 0) months = 0;
    ageYears.value = Math.floor(months / 12);
    ageMonths.value = months % 12;
  }

  dobInput.addEventListener('change', updateAge);
  updateAge();
}

// Insurance registration: show only the sections for the chosen insurance type.
// Sections carry data-insurance-types="HEALTH_POLICY GROUP_POLICY GOVT_SCHEME" (any of these).
const insuranceTypeRadios = document.querySelectorAll('input[name="insuranceType"]');
if (insuranceTypeRadios.length) {
  function showInsuranceSections() {
    const selected = document.querySelector('input[name="insuranceType"]:checked').value;
    document.querySelectorAll('[data-insurance-types]').forEach(function (section) {
      section.hidden = !section.dataset.insuranceTypes.split(' ').includes(selected);
    });
  }

  insuranceTypeRadios.forEach(function (radio) {
    radio.addEventListener('change', showInsuranceSections);
  });
  showInsuranceSections();
}

// Document upload: show the chosen file name under the "Upload file" button
document.querySelectorAll('[data-upload] input[type="file"]').forEach(function (fileInput) {
  fileInput.addEventListener('change', function () {
    const nameLabel = fileInput.closest('[data-upload]').querySelector('[data-file-name]');
    nameLabel.textContent = fileInput.files.length ? fileInput.files[0].name : '';
  });
});

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

// Book appointment: Search shows only the doctors whose name or speciality matches.
// Each doctor card carries data-doctor-search="Dr Name Speciality".
const doctorSearchForm = document.getElementById('doctor-search');
if (doctorSearchForm) {
  doctorSearchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const query = document.getElementById('doctor-search-input').value.trim().toLowerCase();
    let shown = 0;

    document.querySelectorAll('[data-doctor-search]').forEach(function (card) {
      const matches = card.dataset.doctorSearch.toLowerCase().includes(query);
      card.classList.toggle('hidden', !matches);
      if (matches) shown++;
    });

    document.getElementById('doctor-count').textContent = shown;
  });
}

// OPD desk: "Got it" hides the doctor-paused banner
const dismissOpdBanner = document.getElementById('dismiss-opd-banner');
if (dismissOpdBanner) {
  dismissOpdBanner.addEventListener('click', function () {
    document.getElementById('opd-banner').classList.add('hidden');
  });
}

// OPD desk: "Mark arrived" sets the patient to Waiting and shows the Fill OP button
document.querySelectorAll('[data-mark-arrived]').forEach(function (button) {
  button.addEventListener('click', function () {
    const row = button.closest('[data-checkin-row]');
    row.classList.add('bg-amber-50/60');
    row.querySelector('[data-checkin-status]').innerHTML =
      '<span class="pill bg-amber-100 text-amber-800">Waiting</span>';
    row.querySelector('[data-checkin-action]').innerHTML =
      '<a href="op-sheet.html" class="inline-flex items-center h-9 px-4 rounded-md border border-blue-600 bg-white text-[15px] font-medium text-blue-600 hover:bg-blue-50 whitespace-nowrap">Fill OP</a>';
  });
});

// OP sheet: allergy fields show only when "Has allergies" is selected
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

// OP sheet: BMI is worked out from weight (kg) and height (cm)
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

// Consultation summary: Print button opens the browser's print dialog
document.querySelectorAll('[data-print]').forEach(function (button) {
  button.addEventListener('click', function () {
    window.print();
  });
});

// Notifications: filter buttons show only the notifications of that category.
// Each notification carries data-notification-category="OP" / "REPORT" / "PHARMACY" / "SURGERY".
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

// Notifications: "Mark all as read" removes the unread dots and the "new" counts
const markAllReadButton = document.getElementById('mark-all-read');
if (markAllReadButton) {
  markAllReadButton.addEventListener('click', function () {
    document.querySelectorAll('[data-unread-dot], [data-new-badge]').forEach(function (element) {
      element.classList.add('hidden');
    });
  });
}

// Book surgery: "Start time in OT 1" label follows the selected operation theatre
const otSlotLabel = document.getElementById('ot-slot-label');
if (otSlotLabel) {
  document.querySelectorAll('input[name="operationTheatre"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      otSlotLabel.textContent = 'Start time in ' + this.value;
    });
  });
}

// Diagnostics and tests: "Add test" adds the chosen test to the table, × removes it.
// The count, total and "not added yet" message are worked out again after each change.
const addTestForm = document.getElementById('add-test-form');
if (addTestForm) {
  const addedTests = document.getElementById('added-tests');
  const departmentPills = {
    Lab: 'bg-[#e6f4ee] text-[#2c7556]',
    Radiology: 'bg-[#e7f0f8] text-[#245d85]',
    Cardiology: 'bg-purple-50 text-purple-700'
  };

  function updateAddedTests() {
    const rows = addedTests.querySelectorAll('[data-added-test]');
    let total = 0;
    const addedNames = [];

    rows.forEach(function (row) {
      total += parseFloat(row.dataset.price);
      addedNames.push(row.dataset.addedTest);
    });

    document.getElementById('added-tests-count').textContent = rows.length + (rows.length === 1 ? ' test' : ' tests');
    document.getElementById('added-tests-total').textContent =
      total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const notAdded = [];
    document.querySelectorAll('[data-op-test]').forEach(function (opRow) {
      if (!addedNames.includes(opRow.dataset.opTest)) notAdded.push(opRow.dataset.opTest);
    });

    document.getElementById('tests-not-added').classList.toggle('hidden', notAdded.length === 0);
    document.getElementById('tests-not-added-text').textContent =
      notAdded.length + (notAdded.length === 1 ? ' test' : ' tests') + ' in the OP ' +
      (notAdded.length === 1 ? 'is' : 'are') + ' not added yet: ' + notAdded.join(', ') + '.';
  }

  addTestForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const option = document.getElementById('test-choice').selectedOptions[0];
    if (!option.value) return;
    if (addedTests.querySelector('[data-added-test="' + option.value + '"]')) return;

    const urgency = addTestForm.querySelector('input[name="testUrgency"]:checked').value;
    const reportIn = document.getElementById('reporting-hours').value || option.dataset.report;
    const note = document.getElementById('diagnostics-note').value.trim();
    const preparation = option.dataset.preparation;

    const row = document.createElement('tr');
    row.dataset.addedTest = option.value;
    row.dataset.price = option.dataset.price;
    row.innerHTML =
      '<td class="px-6 py-4"></td>' +
      '<td class="px-4 py-4 font-mono text-sm text-subtle">' + option.dataset.code + '</td>' +
      '<td class="px-4 py-4"><span class="pill ' + departmentPills[option.dataset.department] + '">' + option.dataset.department + '</span></td>' +
      '<td class="px-4 py-4">' + option.dataset.sample + '</td>' +
      '<td class="px-4 py-4' + (preparation === 'None' ? '' : ' font-semibold text-[#a3600b]') + '">' + preparation + '</td>' +
      '<td class="px-4 py-4">' + (urgency === 'Urgent'
        ? '<span class="inline-flex px-2 py-0.5 rounded bg-[#fcf1f0] text-[13px] text-[#8e3a31]">Urgent</span>'
        : '<span class="inline-flex px-2 py-0.5 rounded bg-slate-100 text-[13px] text-slate-600">Routine</span>') + '</td>' +
      '<td class="px-4 py-4">' + reportIn + '</td>' +
      '<td class="px-4 py-4 whitespace-normal' + (note ? '' : ' text-subtle') + '"></td>' +
      '<td class="px-4 py-4 text-right">' + parseFloat(option.dataset.price).toFixed(2) + '</td>' +
      '<td class="px-4 py-4 text-right">' +
        '<button type="button" data-remove-test class="w-8 h-8 inline-grid place-items-center rounded-md border border-line bg-white text-subtle hover:bg-page">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button>' +
      '</td>';
    row.children[0].textContent = option.value;
    row.children[7].textContent = note || '—';
    row.querySelector('[data-remove-test]').setAttribute('aria-label', 'Remove ' + option.value);

    addedTests.appendChild(row);
    addTestForm.reset();
    updateAddedTests();
  });

  addedTests.addEventListener('click', function (event) {
    const removeButton = event.target.closest('[data-remove-test]');
    if (!removeButton) return;
    removeButton.closest('[data-added-test]').remove();
    updateAddedTests();
  });
}

// Final billing: the UPI QR shows only for UPI, and the pay button text follows the payment mode.
// The QR block carries data-payment-modes="UPI"; each radio carries its button text in data-confirm-label.
const paymentModeRadios = document.querySelectorAll('input[name="paymentMode"]');
if (paymentModeRadios.length) {
  function showPaymentMode() {
    const selected = document.querySelector('input[name="paymentMode"]:checked');
    document.querySelectorAll('[data-payment-modes]').forEach(function (block) {
      block.hidden = !block.dataset.paymentModes.split(' ').includes(selected.value);
    });
    document.getElementById('payment-confirm-label').textContent = selected.dataset.confirmLabel;
  }

  paymentModeRadios.forEach(function (radio) {
    radio.addEventListener('change', showPaymentMode);
  });
  showPaymentMode();
}

// Patient registration: "Spouse's name" label follows the selected guardian type
const guardianNameLabel = document.getElementById('guardian-name-label-text');
if (guardianNameLabel) {
  const guardianLabels = {
    father: "Father's name",
    mother: "Mother's name",
    spouse: "Spouse's name",
    guardian: "Guardian's name"
  };
  document.querySelectorAll('input[name="guardianType"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      guardianNameLabel.textContent = guardianLabels[this.value];
    });
  });
}