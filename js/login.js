// Login page: show / hide password
document.getElementById('password-toggle').addEventListener('click', function () {
  const input = document.getElementById('password');
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  this.setAttribute('aria-pressed', show);
  this.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
});
