import config from '../config';

export function buildUrl(uri, searchParams) {
	return `${config.API_BASE_URL}${uri}?${new URLSearchParams(searchParams)}`;
}

export async function post(uri, searchParams, data) {
	const response = await fetch(buildUrl(uri, searchParams), {
		method: 'POST',
		body: typeof data === 'string' ? data : JSON.stringify(data),
		headers:
			typeof data !== 'string'
				? {
						'Content-Type': 'application/json',
				  }
				: {},
	});

	if (response.ok) {
		return await response.json();
	} else {
		return Promise.reject(response.status);
	}
}

export async function get(uri, searchParams = {}, options = {}) {
	const response = await fetch(buildUrl(uri, searchParams, options));
	if (response.ok) {
		return await response.json();
	}
	throw new Error('Bad response');
}
