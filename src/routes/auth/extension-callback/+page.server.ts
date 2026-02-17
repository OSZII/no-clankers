import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { hasActiveSubscription } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.session || !locals.user) {
		return redirect(302, '/auth/login?redirect=extension');
	}

	const active = await hasActiveSubscription(locals.user.id);

	return {
		token: locals.session.token,
		user: {
			id: locals.user.id,
			name: locals.user.name,
			image: locals.user.image
		},
		subscription: { active }
	};
};
