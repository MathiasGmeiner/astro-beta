class KirbyApiError extends Error {
	public url: string;
	public status: number;

	constructor(message: string, status: number, url: string) {
		super(message);
		this.status = status;
		this.url = url;
		this.message = message;
		this.name = 'KirbyApiError';
	}
}

export async function queryKirby(uri: string) {
	const url = `${import.meta.env.KIRBY_URL}/${uri}`;

	console.log('fetching', url);
	const response = await fetch(url, {
		method: 'GET',
	});

	if (response.status !== 200) {
		console.log(
			'Error fetching',
			url,
			response.status,
			response.statusText
		);
		throw new KirbyApiError(await response.text(), response.status, url);
	}

	return await response.json();
}

export async function getPage(slug: string | null) {
	try {
		return await queryKirby(`${slug}.json`);
	} catch (e: unknown) {
		if ((e as KirbyApiError).status === 404) {
			return null;
		}

		throw e;
	}
}

export async function getGlobal() {
	return await queryKirby(`global.json`);
}

export async function getIndex() {
	return await queryKirby('index.json');
}
