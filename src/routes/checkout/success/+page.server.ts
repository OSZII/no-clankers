import { redirect } from '@sveltejs/kit';
import { hasActiveSubscription } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/auth/login');
	}

	const active = await hasActiveSubscription(event.locals.user.id);

	return { user: event.locals.user, subscriptionActive: active };
};
