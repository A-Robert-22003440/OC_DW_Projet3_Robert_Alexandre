import { getTable } from "./API.js";

const table = await getTable();
console.log(table);
export async function recup() {

    for (let i = 0; i < id.length; i++) {
        const id = await response.json();
        const figureElement = document.createElement("figure");
        const imgElement = document.createElement("img");
        const figcaptionElement = document.createElement("figcaption");

        imgElement.src = `${id[i].imageUrl} <br>`;
        figcaptionElement.innerHTML = `<b>${id[i].title}:</b>`;
    }
}