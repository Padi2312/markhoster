import type { markdownPages } from '$lib/server/db/schema';

export type MarkdownPage = typeof markdownPages.$inferSelect;
