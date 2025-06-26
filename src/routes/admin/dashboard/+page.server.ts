import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { markdownPages } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import type { MarkdownPage } from '$lib/types';

export const load: PageServerLoad = async () => {
	try {
		const pages = await db
			.select({
				id: markdownPages.id,
				title: markdownPages.title,
				slug: markdownPages.slug,
				description: markdownPages.description,
				isPublic: markdownPages.isPublic,
				isActive: markdownPages.isActive,
				viewCount: markdownPages.viewCount,
				createdAt: markdownPages.createdAt,
				updatedAt: markdownPages.updatedAt
			})
			.from(markdownPages)
			.orderBy(desc(markdownPages.createdAt))
			.limit(50);

		return {
			pages
		} as { pages: MarkdownPage[] };
	} catch (e) {
		console.error('Error loading pages:', e);
		return {
			pages: []
		};
	}
};
