const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;

    const token = localStorage.getItem('token');

    const headers: any = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);

        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            const errorMessage = data?.error || data?.message || (typeof data === 'string' ? data : 'An error occurred');
            throw new Error(errorMessage);
        }

        return data;
    } catch (error: any) {
        console.error(`HTTP request failed:`, error);
        throw error;
    }
}

export const httpService = {
    get: (endpoint: string, headers?: HeadersInit) => request(endpoint, { method: 'GET', headers }),
    post: (endpoint: string, body?: any, headers?: HeadersInit) => request(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined, headers }),
    patch: (endpoint: string, body?: any, headers?: HeadersInit) => request(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined, headers }),
    delete: (endpoint: string, headers?: HeadersInit) => request(endpoint, { method: 'DELETE', headers }),
};

export default httpService;
