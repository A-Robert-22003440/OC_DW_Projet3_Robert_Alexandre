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
window.addEventListener("DOMContentLoaded", function() {
    loadWorks();
});

