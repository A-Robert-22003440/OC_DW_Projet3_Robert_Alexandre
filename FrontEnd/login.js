import { login } from './API.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorEl = document.getElementById('loginError');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.textContent = '';

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      errorEl.textContent = 'Veuillez saisir votre e-mail et votre mot de passe.';
      return;
    }

    try {
        await login(email, password);
      window.location.href = 'index.html';
    } catch (err) {
      console.error(err);
      if (err.status === 404) {
        errorEl.textContent = 'Utilisateur introuvable.';
      } else if (err.status === 401) {
        errorEl.textContent = 'Identifiants incorrects.';
      } else {
        errorEl.textContent = 'Erreur lors de la connexion. Réessayez.';
      }
    }
  });
});
