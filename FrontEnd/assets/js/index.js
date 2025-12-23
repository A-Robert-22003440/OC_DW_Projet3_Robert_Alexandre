import { fetchWorks, fetchCategories } from './api.js';

async function init() {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;

    const [works, categories] = await Promise.all([fetchWorks(), fetchCategories()]);
    console.log('works', works);
    console.log('categories', categories);
    // vérifier si l'utilisateur est connecté (token présent)
    const isLogged = !!localStorage.getItem('token');

    if (!isLogged) {
        // afficher les filtres seulement si non connecté
        const container = ensureFiltersContainer(gallery);
        container._works = works;
        renderFilterButtons(container, categories);
    } else {
        // masquer les filtres si présents
        const existing = document.querySelector('.filters');
        if (existing) existing.classList.add('hidden');
        // afficher le bandeau d'édition et le bouton modifier
        showEditBanner();
        insertEditButton();
        // transformer le lien login en logout
        setLogoutLink();
    }

    renderGallery(gallery, works);
}

function ensureFiltersContainer(gallery) {
    let container = document.querySelector('.filters');
    if (!container) {
        container = document.createElement('div');
        container.className = 'filters';
        gallery.parentNode.insertBefore(container, gallery);
    }
    if (!container.dataset.listenerAttached) {
        container.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            container.querySelectorAll('button').forEach(b => b.classList.remove('filter-btn--active'));
            btn.classList.add('filter-btn--active');
            const categoryId = btn.dataset.categoryId;
            const works = container._works || [];
            if (categoryId === 'all') {
                renderGallery(gallery, works);
            } else {
                const filtered = works.filter(w => String(w.categoryId) === categoryId || (w.category && String(w.category.id) === categoryId));
                renderGallery(gallery, filtered);
            }
        });
        container.dataset.listenerAttached = '1';
    }
    return container;
}

function createFilterButton(label, id, isActive = false) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filter-btn' + (isActive ? ' filter-btn--active' : '');
    btn.dataset.categoryId = id;
    btn.textContent = label;
    return btn;
}

function renderFilterButtons(container, categories = []) {
    container.innerHTML = '';
    const frag = document.createDocumentFragment();
    frag.appendChild(createFilterButton('Tous', 'all', true));
    categories.forEach(cat => frag.appendChild(createFilterButton(cat.name, String(cat.id))));
    container.appendChild(frag);
}

function showEditBanner() {
    const banner = document.getElementById('edit-banner');
    if (!banner) return;
    banner.style.display = 'block';
    banner.setAttribute('aria-hidden', 'false');
}

function insertEditButton() {
    const portfolio = document.getElementById('portfolio');
    if (!portfolio) return;
    // éviter doublons
    if (document.querySelector('.edit-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'edit-btn';
    btn.type = 'button';
    btn.textContent = 'Modifier';
    // insérer avant le h2 central
    const h2 = portfolio.querySelector('h2');
    if (h2 && h2.parentNode) h2.parentNode.insertBefore(btn, h2.nextSibling);
}

function setLogoutLink() {
    const navLink = document.querySelector('header nav a[href="login.html"]');
    if (!navLink) return;
    navLink.textContent = 'logout';
    navLink.href = '#';
    navLink.addEventListener('click', (e) => {
        e.preventDefault();
        // supprimer token et userId
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        // rediriger vers page d'accueil non connecté
        window.location.href = 'index.html';
    });
}

function createFigure(work) {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const caption = document.createElement('figcaption');
    img.src = work.imageUrl || '';
    img.alt = work.title || '';
    caption.textContent = work.title || '';
    figure.appendChild(img);
    figure.appendChild(caption);
    return figure;
}

export function renderGallery(gallery, works = []) {
    if (!gallery) gallery = document.querySelector('.gallery');
    if (!gallery) return;
    gallery.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (let i = 0; i < works.length; i++) frag.appendChild(createFigure(works[i]));
    gallery.appendChild(frag);
}

window.addEventListener('DOMContentLoaded', init);