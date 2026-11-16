// Admin portal

// Press one button in a group, release the others
function pressOnly(buttons, clicked) {
  buttons.forEach((b) => b.setAttribute('aria-pressed', b === clicked ? 'true' : 'false'));
}

// ---------- Staff and shifts: filter rows by shift ----------
document.querySelectorAll('[data-shift-filters]').forEach((section) => {
  const buttons = section.querySelectorAll('[data-shift-filter]');
  const rows = section.querySelectorAll('[data-staff-row]');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      pressOnly(buttons, button);
      const shift = button.dataset.shiftFilter;
      rows.forEach((row) => {
        row.classList.toggle('hidden', shift !== 'ALL' && row.dataset.shift !== shift);
      });
    });
  });
});

// ---------- Doctors and slots: department pills and search ----------
document.querySelectorAll('[data-doctor-filters]').forEach((section) => {
  const buttons = section.querySelectorAll('[data-doctor-filter]');
  const search = section.querySelector('[data-doctor-search]');
  const rows = section.querySelectorAll('[data-doctor-row]');
  const empty = section.querySelector('[data-no-doctors]');
  let department = 'ALL';

  function apply() {
    const text = search ? search.value.trim().toLowerCase() : '';
    let shown = 0;
    rows.forEach((row) => {
      const show = (department === 'ALL' || row.dataset.department === department)
        && (!text || row.dataset.search.toLowerCase().includes(text));
      row.classList.toggle('hidden', !show);
      if (show) shown += 1;
    });
    if (empty) empty.hidden = shown > 0;
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      pressOnly(buttons, button);
      department = button.dataset.doctorFilter;
      apply();
    });
  });

  if (search) search.addEventListener('input', apply);
});