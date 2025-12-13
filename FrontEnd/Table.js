import { fetchWorks, fetchCategories } from './API.js';

// Initialization
async function init() {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;

    const [works, categories] = await Promise.all([fetchWorks(), fetchCategories()]);
    console.log('works', works);
    console.log('categories', categories);

    const container = ensureFiltersContainer(gallery);
    container._works = works; // cache works on container for quick access
    renderFilterButtons(container, categories);
    renderGallery(gallery, works);
}

function ensureFiltersContainer(gallery) {
    let container = document.querySelector('.filters');
    if (!container) {
        container = document.createElement('div');
        container.className = 'filters';
        gallery.parentNode.insertBefore(container, gallery);
    }
    // attach listener once
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