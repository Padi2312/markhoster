import type { pageAssets } from '$lib/server/db/schema';

export type PageAsset = typeof pageAssets.$inferSelect;
