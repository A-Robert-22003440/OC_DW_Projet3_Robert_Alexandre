/*export async function ?() {

    for (let i = 0; i < id.length; i++) {
        const imageUrl = await fetch(`http://localhost:5678/api/works/${id}/imageUrl`);
        const title = await fetch(`http://localhost:5678/api/works/${id}/title`);
        const id = await response.json();
        const figureElement = document.createElement("figure");
        const imgElement = document.createElement("img");
        const figcaptionElement = document.createElement("figcaption");

        imgElement.src = `${id[i].imageUrl} <br>`;
        figcaptionElement.innerHTML = `<b>${id[i].title}:</b>`;
    }
}*/
var works = [];
async function fetchWorks() {
    let response = await fetch("http://localhost:5678/api/works");
    if (response.ok) {
        return await response.json();
    }
}
async function loadWorks() {
    works = await fetchWorks();
    console.log(works);
}
loadWorks();
