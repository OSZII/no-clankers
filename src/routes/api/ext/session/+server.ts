import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { hasActiveSubscription } from '$lib/server/auth';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.session || !locals.user) {
		return json({ error: 'Not authenticated' }, { status: 401 });
	}

	const active = await hasActiveSubscription(locals.user.id);

	return json({
		token: locals.session.token,
		user: {
			id: locals.user.id,
			name: locals.user.name,
			email: locals.user.email,
			image: locals.user.image
		},
		subscription: { active }
	});
};
