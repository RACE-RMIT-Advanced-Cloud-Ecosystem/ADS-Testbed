const getApiBasePath = () => {
  const basePath = import.meta.env.VITE_API_BASE_PATH ?? (import.meta.env.PROD ? '/dashboard' : '');
  return basePath + '/api/';
};

export const endpointUrl = import.meta.env.DEV ? import.meta.env.VITE_BACKEND_ENDPOINT_URL : getApiBasePath();

/**
 * a wrapper for fetch api
 * @param input {RequestInfo | URL} 
 * @param init {RequestInit}
 * @param options {{ parseBody?: boolean, parseResponse?: boolean }}
 * @returns {Promise<any | Response>}
 */
export default async function request(input, init = {}, { parseBody = true, parseResponse = true } = {}) {
    const baseUrl = endpointUrl.endsWith('/') ? endpointUrl : endpointUrl + '/';
    
    let processedInput = input;
    if (typeof input === 'string' && input.includes('?')) {
        const [path, queryString] = input.split('?');
        const params = new URLSearchParams(queryString);
        processedInput = path + '?' + params.toString();
    }
    
    const url = new URL(processedInput, new URL(baseUrl, window.location.origin));

    init.headers ??= {};
    
    if (init.body && typeof init.body === 'object' && parseBody) {
        init.body = JSON.stringify(init.body);
        init.headers['Content-Type'] ??= 'application/json';
    }

    const response = await fetch(url, init);
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch {
            errorData = response.statusText;
        }
        throw new Error(response.statusText, { cause: errorData });
    }
    if (parseResponse) {
        return await response.json();
    }
    return response;
}

export async function post(input, init = {}, { parseBody = true, parseResponse = true } = {}) {
    return await request(input, {
        ...init,
        method: 'POST',
    }, { parseBody, parseResponse });
}