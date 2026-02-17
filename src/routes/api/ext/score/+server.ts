import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { hasActiveSubscription } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { cache } from '$lib/server/db/schema';
import { inArray } from 'drizzle-orm';
import { createHash } from 'node:crypto';

function hashText(text: string): string {
	return createHash('sha256').update(text).digest('hex');
}

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.session || !locals.user) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	const active = await hasActiveSubscription(locals.user.id);
	if (!active) {
		return json({ error: 'Subscription required' }, { status: 403 });
	}

	const body = await request.json();
	const texts: string[] = body.texts;

	if (!Array.isArray(texts) || texts.length === 0 || texts.length > 25) {
		return json({ error: 'texts must be an array of 1–25 strings' }, { status: 400 });
	}

	const hashes = texts.map(hashText);

	// Look up cached scores
	const cached = await db.select().from(cache).where(inArray(cache.hash, hashes));
	const cacheMap = new Map(cached.map((row) => [row.hash, row.score]));

	const scores: (number | null)[] = hashes.map((hash) => {
		const score = cacheMap.get(hash);
		if (score !== undefined) return score;

		// TODO: call AI detection model here
		// For now, return 0 (assume human)
		return 0;
	});

	// Cache new scores
	const newEntries = hashes
		.map((hash, i) => ({ hash, score: scores[i]! }))
		.filter((entry) => !cacheMap.has(entry.hash));

	if (newEntries.length > 0) {
		await db.insert(cache).values(newEntries).onConflictDoNothing();
	}

	return json({ scores });
};
