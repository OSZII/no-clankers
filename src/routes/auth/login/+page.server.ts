import { redirect } from '@sveltejs/kit';
// @ts-ignore
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event: any) => {
	if (event.locals.user) {
		return redirect(302, '/dashboard');
	}
	return {};
};
