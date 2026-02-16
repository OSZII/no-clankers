import { redirect } from '@sveltejs/kit';
// @ts-ignore
import type { Actions } from '../auth/$types';
// @ts-ignore
import type { PageServerLoad } from '../auth/$types';
import { auth } from '$lib/server/auth';

export const load: PageServerLoad = async (event: any) => {
	if (!event.locals.user) {
		return redirect(302, '/auth/login');
	}
	return { user: event.locals.user };
};

export const actions: Actions = {
	signOut: async (event: any) => {
		await auth.api.signOut({
			headers: event.request.headers
		});
		return redirect(302, '/auth/login');
	}
};
