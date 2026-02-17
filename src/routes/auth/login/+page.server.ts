import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		const redirectParam = event.url.searchParams.get('redirect');
		if (redirectParam === 'extension') {
			return redirect(302, '/auth/extension-callback');
		}
		if (redirectParam === 'checkout') {
			return redirect(302, '/checkout');
		}
		return redirect(302, '/dashboard');
	}
	return {};
};
