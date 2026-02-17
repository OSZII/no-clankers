import { redirect } from '@sveltejs/kit';
import { auth, hasActiveSubscription } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/auth/login');
	}

	const active = await hasActiveSubscription(event.locals.user.id);
	if (!active) {
		return redirect(302, '/checkout');
	}

	return { user: event.locals.user };
};

export const actions: Actions = {
	signOut: async (event) => {
		await auth.api.signOut({
			headers: event.request.headers
		});
		return redirect(302, '/auth/login');
	}
};
