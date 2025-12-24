import { fetchWorks, fetchCategories, deleteWork, createWork } from './api.js';

let STATE = { works: [], categories: [] };

async function init() {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;

    const [works, categories] = await Promise.all([fetchWorks(), fetchCategories()]);
    console.log('works', works);
    console.log('categories', categories);
    const isLogged = !!localStorage.getItem('token');

    STATE.works = works;
    STATE.categories = categories;

    const editBanner = document.getElementById('edit-banner');
    if (editBanner) {
        if (isLogged) {
            editBanner.style.display = 'flex';
            editBanner.setAttribute('aria-hidden', 'false');
            document.body.classList.add('edit-mode');
        } else {
            editBanner.style.display = 'none';
            editBanner.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('edit-mode');
        }
    }

    if (!isLogged) {
        const container = ensureFiltersContainer(gallery);
        container._works = works;
        renderFilterButtons(container, categories);
    } else {
        const existing = document.querySelector('.filters');
        if (existing) existing.classList.add('hidden');
        insertEditButton();
        setLogoutLink();
    }

    renderGallery(gallery, STATE.works);
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
    banner.style.display = 'flex';
    banner.setAttribute('aria-hidden', 'false');
    document.body.classList.add('edit-mode');
}

function insertEditButton() {
    const portfolio = document.getElementById('portfolio');
    if (!portfolio) return;
    if (document.querySelector('.edit-btn')) return;
    const h2 = portfolio.querySelector('h2');
    if (!h2) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'portfolio-header';
    h2.parentNode.insertBefore(wrapper, h2);
    wrapper.appendChild(h2);
    const btn = document.createElement('button');
    btn.className = 'edit-btn';
    btn.type = 'button';
    btn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> modifier';
    wrapper.appendChild(btn);
    btn.addEventListener('click', openModal);
}

function setLogoutLink() {
    const navLink = document.querySelector('header nav a[href="login.html"]');
    if (!navLink) return;
    navLink.textContent = 'logout';
    navLink.href = '#';
    navLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = 'index.html';
    });
}

/* Modale */
function ensureModalRoot() {
    let overlay = document.getElementById('modalOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'modalOverlay';
        overlay.className = 'modal-overlay';
        document.body.appendChild(overlay);
    }
    return overlay;
}

function openModal() {
    const overlay = ensureModalRoot();
    overlay.innerHTML = '';
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.addEventListener('click', (e) => e.stopPropagation());

    const header = document.createElement('div');
    header.className = 'modal-header';
    const backBtn = document.createElement('button');
    backBtn.className = 'modal-back hidden';
    backBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
    const title = document.createElement('h3');
    title.textContent = 'Galerie photo';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    header.appendChild(backBtn);
    header.appendChild(title);
    header.appendChild(closeBtn);

    const body = document.createElement('div');
    body.className = 'modal-body';

    modal.appendChild(header);
    modal.appendChild(body);
    overlay.appendChild(modal);

    overlay.style.display = 'flex';
    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    backBtn.addEventListener('click', () => showGalleryView({ overlay, modal, body, header, backBtn, title }));

    showGalleryView({ overlay, modal, body, header, backBtn, title });
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (!overlay) return;
    overlay.style.display = 'none';
    overlay.innerHTML = '';
}

function showGalleryView(ctx) {
    const { body, title, backBtn } = ctx;
    title.textContent = 'Galerie photo';
    backBtn.classList.add('hidden');
    body.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'modal-gallery';
    STATE.works.forEach(w => {
        const item = document.createElement('div');
        item.className = 'modal-thumb';
        const img = document.createElement('img');
        img.src = w.imageUrl;
        img.alt = w.title || '';
        const trash = document.createElement('button');
        trash.className = 'btn-trash';
        trash.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        trash.addEventListener('click', async () => {
            const resp = await deleteWork(w.id);
            if (resp && resp.ok) {
                STATE.works = STATE.works.filter(x => x.id !== w.id);
                renderGallery(document.querySelector('.gallery'), STATE.works);
                showGalleryView(ctx);
            } else {
                alert('Suppression impossible');
            }
        });
        item.appendChild(img);
        item.appendChild(trash);
        grid.appendChild(item);
    });

    body.appendChild(grid);
    const actions = document.createElement('div');
    actions.className = 'modal-actions';
    const addBtn = document.createElement('button');
    addBtn.className = 'btn-primary';
    addBtn.textContent = 'Ajouter une photo';
    actions.appendChild(addBtn);
    body.appendChild(actions);
    addBtn.addEventListener('click', () => showFormView(ctx));
}

function showFormView(ctx) {
    const { body, title, backBtn } = ctx;
    title.textContent = 'Ajout photo';
    backBtn.classList.remove('hidden');
    body.innerHTML = '';
    body.classList.add('form-view');

    const form = document.createElement('form');
    form.className = 'add-work-form';

    const upload = document.createElement('div');
    upload.className = 'upload-zone';
    const icon = document.createElement('div');
    icon.innerHTML = '<i class="fa-regular fa-image" style="font-size:32px;color:#B3B3B3"></i>';
    const btnUpload = document.createElement('button');
    btnUpload.type = 'button';
    btnUpload.className = 'btn-primary';
    btnUpload.style.background = '#B3B3B3';
    btnUpload.textContent = 'Ajouter une photo';
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.name = 'image';
    fileInput.id = 'work-image';
    const preview = document.createElement('img');
    preview.className = 'preview hidden';
    upload.appendChild(icon);
    upload.appendChild(btnUpload);
    upload.appendChild(fileInput);
    upload.appendChild(preview);

    btnUpload.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
        const f = fileInput.files && fileInput.files[0];
        if (f) {
            const reader = new FileReader();
            reader.onload = () => {
                preview.src = reader.result;
                preview.classList.remove('hidden');
            };
            reader.readAsDataURL(f);
        }
    });

    const labelTitle = document.createElement('label');
    labelTitle.textContent = 'Titre';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.name = 'title';

    const labelCat = document.createElement('label');
    labelCat.textContent = 'Catégorie';
    const select = document.createElement('select');
    select.name = 'category';
    STATE.categories.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        select.appendChild(opt);
    });

    const submit = document.createElement('button');
    submit.className = 'btn-primary btn-submit';
    submit.type = 'submit';
    submit.textContent = 'Valider';

    form.appendChild(upload);
    form.appendChild(labelTitle);
    form.appendChild(titleInput);
    form.appendChild(labelCat);
    form.appendChild(select);
    form.appendChild(submit);

    body.appendChild(form);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const file = fileInput.files && fileInput.files[0];
        const titleVal = titleInput.value.trim();
        const catVal = select.value;
        if (!file || !titleVal || !catVal) {
            alert('Veuillez compléter tous les champs.');
            return;
        }
        const fd = new FormData();
        fd.append('image', file);
        fd.append('title', titleVal);
        fd.append('category', catVal);
        const resp = await createWork(fd);
        if (resp && resp.ok) {
            const newWork = await resp.json();
            STATE.works.push(newWork);
            renderGallery(document.querySelector('.gallery'), STATE.works);
            showGalleryView(ctx);
        } else {
            alert('Ajout impossible');
        }
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