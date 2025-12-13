import { fetchWorks } from "./API.js";

window.addEventListener('DOMContentLoaded', async () => {
    const works = await fetchWorks();
    console.log(works);
    recup(works);
});

export function recup(works = []) {
    const gallery = document.querySelector('.gallery');
    if (!gallery) return;
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