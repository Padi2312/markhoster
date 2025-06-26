import { db } from '$lib/server/db';
import { markdownPages, pageAssets } from '$lib/server/db/schema';
import type { RequestHandler } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import * as fs from 'fs/promises';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

const ASSETS_DIR = path.resolve('files', 'assets');

// Allowed asset types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'text/plain', 'application/json'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function getAssetType(mimetype: string): string {
	if (ALLOWED_IMAGE_TYPES.includes(mimetype)) return 'image';
	if (ALLOWED_DOCUMENT_TYPES.includes(mimetype)) return 'document';
	return 'other';
}

function getFileExtension(mimetype: string): string {
	const extensions: Record<string, string> = {
		'image/jpeg': '.jpg',
		'image/png': '.png',
		'image/gif': '.gif',
		'image/webp': '.webp',
		'image/svg+xml': '.svg',
		'application/pdf': '.pdf',
		'text/plain': '.txt',
		'application/json': '.json'
	};
	return extensions[mimetype] || '';
}

export const POST: RequestHandler = async ({ params, request, url }) => {
	try {
		const pageId = params.pageId;

		if (!pageId) {
			return new Response(JSON.stringify({ error: 'Page ID required.' }), { status: 400 });
		}

		// Verify the page exists
		const page = await db.select().from(markdownPages).where(eq(markdownPages.id, pageId)).limit(1);
		if (page.length === 0) {
			return new Response(JSON.stringify({ error: 'Page not found.' }), { status: 404 });
		}

		const formData = await request.formData();
		const file = formData.get('file') as File | null;
		const altText = formData.get('altText') as string | null;

		if (!file) {
			return new Response(JSON.stringify({ error: 'No file uploaded.' }), { status: 400 });
		}

		// Check file size
		if (file.size > MAX_FILE_SIZE) {
			return new Response(JSON.stringify({ error: 'File too large. Maximum size is 10MB.' }), {
				status: 400
			});
		}

		// Check if file type is allowed
		const assetType = getAssetType(file.type);
		if (assetType === 'other') {
			return new Response(JSON.stringify({ error: 'File type not allowed.' }), { status: 400 });
		}

		const buffer = Buffer.from(await file.arrayBuffer());
		const originalName = file.name;
		const ext = getFileExtension(file.type) || path.extname(originalName);

		const assetId = randomUUID();
		const filename = `${assetId}${ext}`;
		const publicUrl = `${url.origin}/assets/${filename}`;

		await mkdir(ASSETS_DIR, { recursive: true });
		await writeFile(path.join(ASSETS_DIR, filename), buffer);

		// Insert asset record into database
		const [insertedAsset] = await db
			.insert(pageAssets)
			.values({
				pageId,
				filename: originalName,
				filenameOnFilesystem: filename,
				mimetype: file.type,
				size: file.size,
				altText: altText || null,
				assetType,
				publicUrl
			})
			.returning();

		return new Response(
			JSON.stringify({
				success: true,
				asset: {
					id: insertedAsset.id,
					filename: insertedAsset.filename,
					publicUrl: insertedAsset.publicUrl,
					assetType: insertedAsset.assetType,
					size: insertedAsset.size
				}
			}),
			{ status: 201 }
		);
	} catch (e) {
		console.error('Asset upload failed:', e);
		return new Response(JSON.stringify({ error: 'Asset upload failed.' }), { status: 500 });
	}
};

// GET - List all assets for a page
export const GET: RequestHandler = async ({ params }) => {
	try {
		const pageId = params.pageId;

		if (!pageId) {
			return new Response(JSON.stringify({ error: 'Page ID required.' }), { status: 400 });
		}

		// Verify the page exists
		const page = await db.select().from(markdownPages).where(eq(markdownPages.id, pageId)).limit(1);
		if (page.length === 0) {
			return new Response(JSON.stringify({ error: 'Page not found.' }), { status: 404 });
		}

		const assets = await db.select().from(pageAssets).where(eq(pageAssets.pageId, pageId));

		return new Response(
			JSON.stringify({
				success: true,
				assets: assets.map((asset) => ({
					id: asset.id,
					filename: asset.filename,
					publicUrl: asset.publicUrl,
					assetType: asset.assetType,
					size: asset.size,
					altText: asset.altText,
					createdAt: asset.createdAt
				}))
			}),
			{ status: 200 }
		);
	} catch (e) {
		console.error('Failed to fetch assets:', e);
		return new Response(JSON.stringify({ error: 'Failed to fetch assets.' }), { status: 500 });
	}
};

// DELETE - Remove an asset
export const DELETE: RequestHandler = async ({ params, request }) => {
	try {
		const pageId = params.pageId;
		const { assetId } = await request.json();

		if (!pageId || !assetId) {
			return new Response(JSON.stringify({ error: 'Page ID and Asset ID required.' }), {
				status: 400
			});
		}

		// Verify the page and asset exist
		const asset = await db.select().from(pageAssets).where(eq(pageAssets.id, assetId)).limit(1);

		if (asset.length === 0 || asset[0].pageId !== pageId) {
			return new Response(JSON.stringify({ error: 'Asset not found.' }), { status: 404 });
		}

		// Delete from database
		await db.delete(pageAssets).where(eq(pageAssets.id, assetId));
		await fs.unlink(path.join(ASSETS_DIR, asset[0].filenameOnFilesystem));

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (e) {
		console.error('Failed to delete asset:', e);
		return new Response(JSON.stringify({ error: 'Failed to delete asset.' }), { status: 500 });
	}
};
