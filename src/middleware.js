import { Cacheable } from 'cacheable';
import Keyv from 'keyv';
import KeyvSqlite from '@keyv/sqlite';
import { Buffer } from 'node:buffer';
import * as fs from 'node:fs';

// check if cache directory exists
if (!fs.existsSync('.cache')) {
	fs.mkdirSync('.cache');
}

const keyvContent = new Keyv(new KeyvSqlite('sqlite://.cache/db.sqlite'), {
	namespace: 'content',
});

const keyvImages = new Keyv(new KeyvSqlite('sqlite://.cache/db.sqlite'), {
	namespace: 'images',
});

const cacheContent = new Cacheable({ secondary: keyvContent });
const cacheImages = new Cacheable({ secondary: keyvImages });

export async function onRequest(req, next) {
	if (process.env.NODE_ENV === 'development') {
		return next();
	}

	console.log('[Middleware] onRequest', req.url);

	// handle cache clearing
	if (req.url.pathname === '/api/revalidate') {
		console.log('[Middleware] Clearing content cache');
		cacheContent.clear();

		return new Response('Cache cleared');
	}

	// Skip caching for non-GET requests and API requests
	if (req.request.method !== 'GET' || req.url.pathname.startsWith('/api')) {
		return next();
	}

	const cache = req.url.pathname.startsWith('/_image')
		? cacheImages
		: cacheContent;

	const cached = await cache.get(req.url.href);
	if (cached) {
		console.log('[Middleware] Cache hit', req.url.href);
		const body = Buffer.from(cached.body, 'base64');

		return new Response(body, {
			status: cached.status,
			headers: cached.headers,
		});
	}

	const response = await next();

	// only cache 200 responses
	if (response.status !== 200) {
		return response;
	}

	const clonedResponse = response.clone();
	const buffer = Buffer.from(await clonedResponse.arrayBuffer());

	await cache.set(req.url.href, {
		body: buffer.toString('base64'),
		status: clonedResponse.status,
		headers: Object.fromEntries(clonedResponse.headers),
	});

	return response;
}
