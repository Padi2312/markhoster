import { processMarkdown } from '$lib/server/core';
import { db } from '$lib/server/db';
import { markdownPages, pageAssets } from '$lib/server/db/schema';
import type { PageAsset } from '$lib/server/db/types';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	if (!slug) {
		throw error(404, 'Page not found');
	}

	try {
		// Get the page by slug
		const [page] = await db
			.select()
			.from(markdownPages)
			.where(eq(markdownPages.slug, slug))
			.limit(1);

		if (!page || !page.isActive || !page.isPublic) {
			throw error(404, 'Page not found');
		}

		// Get associated assets
		const assets: PageAsset[] = await db
			.select()
			.from(pageAssets)
			.where(eq(pageAssets.pageId, page.id));

		// Increment view count
		await db
			.update(markdownPages)
			.set({ viewCount: page.viewCount + 1 })
			.where(eq(markdownPages.id, page.id));

		const content = processMarkdown(page.content, assets);

		return {
			page: {
				id: page.id,
				title: page.title,
				content: content,
				description: page.description,
				viewCount: page.viewCount + 1,
				createdAt: page.createdAt,
				updatedAt: page.updatedAt
			},
			assets: assets.map((asset) => ({
				id: asset.id,
				filename: asset.filename,
				publicUrl: asset.publicUrl,
				assetType: asset.assetType,
				altText: asset.altText
			}))
		};
	} catch (e) {
		console.error('Error loading page:', e);
		throw error(500, 'Failed to load page');
	}
};
