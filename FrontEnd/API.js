export async function fetchWorks() {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        if (!response.ok) {
            console.error('fetchWorks: réponse HTTP non OK', response.status);
            return [];
        }
        return await response.json();
    } catch (err) {
        console.error('fetchWorks a échoué — vérifiez le backend / CORS', err);
        return [];
    }
}