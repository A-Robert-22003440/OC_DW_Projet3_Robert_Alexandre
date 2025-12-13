import { fetchWorks, fetchCategories } from "./API.js";

window.addEventListener('DOMContentLoaded', async () => {
    const [works, categories] = await Promise.all([fetchWorks(), fetchCategories()]);
    console.log('works', works);
    console.log('categories', categories);
    renderFilters(categories, works);
    renderGallery(works);
});

function createFilterButton(label, id, isActive = false) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filter-btn' + (isActive ? ' filter-btn--active' : '');
    btn.dataset.categoryId = id;
    btn.textContent = label;
    return btn;
}

function renderFilters(categories = [], works = []) {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;
    // Create container above gallery
    let container = document.querySelector('.filters');
    if (!container) {
        container = document.createElement('div');
        container.className = 'filters';
        gallery.parentNode.insertBefore(container, gallery);
    } else {
        container.innerHTML = '';
    }

    // Tous button
    const allBtn = createFilterButton('Tous', 'all', true);
    container.appendChild(allBtn);

    // category buttons
    categories.forEach(cat => {
        const btn = createFilterButton(cat.name, String(cat.id), false);
        container.appendChild(btn);
    });

    // event delegation for performance
    container.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        // toggle active class
        container.querySelectorAll('button').forEach(b => b.classList.remove('filter-btn--active'));
        btn.classList.add('filter-btn--active');

        const categoryId = btn.dataset.categoryId;
        if (categoryId === 'all') {
            renderGallery(works);
        } else {
            const filtered = works.filter(w => String(w.categoryId) === categoryId || (w.category && String(w.category.id) === categoryId));
            renderGallery(filtered);
        }
    });
}

export function renderGallery(works = []) {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;
    gallery.innerHTML = '';
    for (let i = 0; i < works.length; i++) {
        const figureElement = document.createElement('figure');
        const imgElement = document.createElement('img');
        const figcaptionElement = document.createElement('figcaption');

        imgElement.src = works[i].imageUrl || '';
        imgElement.alt = works[i].title || '';
        figcaptionElement.textContent = works[i].title || '';

        figureElement.appendChild(imgElement);
        figureElement.appendChild(figcaptionElement);
        gallery.appendChild(figureElement);
    }
}