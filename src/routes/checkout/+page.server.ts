import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { subscription } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/auth/login?redirect=checkout');
	}

	const existing = await db.query.subscription.findFirst({
		where: eq(subscription.userId, event.locals.user.id)
	});

	if (existing?.status === 'active') {
		return redirect(302, '/dashboard');
	}

	return {};
};
