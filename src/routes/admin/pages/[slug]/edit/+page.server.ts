
import { db } from '$lib/server/db';
import { markdownPages } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { PageServerLoad, Actions } from './$types';

const schema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().nullable(),
	content: z.string().min(1, 'Content is required'),
	isPublic: z.boolean()
});

export const load: PageServerLoad = async ({ params, locals }) => {
	const session = await locals.auth();
	if (!session?.user) {
		throw redirect(303, '/login');
	}

	const { slug } = params;

	if (!slug) {
		throw error(404, 'Page not found');
	}

	try {
		const [page] = await db
			.select()
			.from(markdownPages)
			.where(eq(markdownPages.slug, slug))
			.limit(1);

		if (!page) {
			throw error(404, 'Page not found');
		}

		const form = await superValidate(page, zod(schema));

		return {
			form,
			page: {
				id: page.id,
				slug: page.slug,
				title: page.title,
				content: page.content,
				description: page.description,
				isPublic: page.isPublic
			}
		};
	} catch (e) {
		console.error('Error loading page for editing:', e);
		throw error(500, 'Failed to load page for editing');
	}
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		const session = await locals.auth();
		if (!session?.user) {
			throw redirect(303, '/login');
		}

		const { slug } = params;

		const form = await superValidate(request, zod(schema));

		if (!form.valid) {
			return { form };
		}

		if (!slug) {
			throw error(404, 'Page not found');
		}

		try {
			await db
				.update(markdownPages)
				.set({
					content: form.data.content,
					title: form.data.title,
					description: form.data.description,
					isPublic: form.data.isPublic,
					updatedAt: new Date()
				})
				.where(eq(markdownPages.slug, slug));
		} catch (e) {
			console.error('Error updating page:', e);
			throw error(500, 'Failed to update page');
		}

		throw redirect(303, `/admin/dashboard`);
	}
};
