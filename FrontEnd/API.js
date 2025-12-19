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

export async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        if (!response.ok) {
            console.error('fetchCategories: réponse HTTP non OK', response.status);
            return [];
        }
        return await response.json();
    } catch (err) {
        console.error('fetchCategories a échoué — vérifiez le backend / CORS', err);
        return [];
    }
}

export async function login(email, password) {
    const resp = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!resp.ok) {
        const err = new Error('Login failed');
        err.status = resp.status;
        throw err;
    }
    const data = await resp.json();
    if (data.token) localStorage.setItem('token', data.token);
    if (data.userId) localStorage.setItem('userId', data.userId);
    return data;
}

export function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createWork(formData) {
    const headers = getAuthHeaders();
    const resp = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: headers,
        body: formData
    });
    return resp;
}

export async function deleteWork(id) {
    const headers = getAuthHeaders();
    const resp = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: headers
    });
    return resp;
}