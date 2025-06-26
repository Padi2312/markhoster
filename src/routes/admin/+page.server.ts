import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();

	if (session?.user?.id) {
		redirect(302, '/admin/dashboard');
	} else {
		// If the user is not authenticated, redirect to the login page
		redirect(302, '/login');
	}
};
