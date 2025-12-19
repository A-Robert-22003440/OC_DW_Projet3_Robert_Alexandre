// Handle login form submission
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
      const resp = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!resp.ok) {
        if (resp.status === 404) {
          errorEl.textContent = "Utilisateur introuvable.";
        } else if (resp.status === 401) {
          errorEl.textContent = "Identifiants incorrects.";
        } else {
          errorEl.textContent = "Erreur lors de la connexion. Réessayez.";
        }
        return;
      }

      const data = await resp.json();
      // sauvegarder token + userId
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);

      // redirection vers la page d'accueil
      window.location.href = 'index.html';
    } catch (err) {
      console.error(err);
      errorEl.textContent = 'Impossible de contacter le serveur.';
    }
  });
});
