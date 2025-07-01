import type { AdapterAccountType } from '@auth/sveltekit/adapters';
import { boolean, integer, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const timestamps = {
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
	createdAt: timestamp('created_at').defaultNow().notNull()
};

export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: text('name'),
	email: text('email').unique(),
	emailVerified: timestamp('emailVerified', { mode: 'date' }),
	image: text('image'),
	password: text('password'),
	...timestamps
});

export const accounts = pgTable(
	'accounts',
	{
		userId: uuid('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').$type<AdapterAccountType>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state')
	},
	(account) => [
		{
			compoundKey: primaryKey({
				columns: [account.provider, account.providerAccountId]
			})
		}
	]
);

export const sessions = pgTable('sessions', {
	sessionToken: text('sessionToken').primaryKey(),
	userId: uuid('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull()
});

export const authenticators = pgTable(
	'authenticator',
	{
		credentialID: text('credentialID').notNull().unique(),
		userId: uuid('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		providerAccountId: text('providerAccountId').notNull(),
		credentialPublicKey: text('credentialPublicKey').notNull(),
		counter: integer('counter').notNull(),
		credentialDeviceType: text('credentialDeviceType').notNull(),
		credentialBackedUp: boolean('credentialBackedUp').notNull(),
		transports: text('transports')
	},
	(authenticator) => [
		{
			compositePK: primaryKey({
				columns: [authenticator.userId, authenticator.credentialID]
			})
		}
	]
);

// Markdown pages for hosting
export const markdownPages = pgTable('markdown_pages', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: uuid('userId').references(() => users.id, { onDelete: 'cascade' }),
	title: text('title').notNull(),
	slug: text('slug').notNull().unique(), // For URL like /pages/my-awesome-post
	content: text('content').notNull(), // The markdown content
	description: text('description'), // Optional meta description
	isPublic: boolean('is_public').default(true).notNull(),
	isActive: boolean('is_active').default(true).notNull(),
	viewCount: integer('view_count').default(0).notNull(),
	customDomain: text('custom_domain'), // Optional: for custom domain hosting
	...timestamps
});

// Assets associated with markdown pages (images, etc.)
export const pageAssets = pgTable('page_assets', {
	id: uuid('id').defaultRandom().primaryKey(),
	pageId: uuid('page_id')
		.notNull()
		.references(() => markdownPages.id, { onDelete: 'cascade' }),
	filename: text('filename').notNull(), // Original filename
	filenameOnFilesystem: text('filename_on_filesystem').notNull(), // Actual filename on disk
	mimetype: text('mimetype').notNull(),
	size: integer('size').notNull(),
	altText: text('alt_text'), // For accessibility
	assetType: text('asset_type').notNull(), // 'image', 'document', 'video', etc.
	publicUrl: text('public_url').notNull(), // URL to access the asset
	...timestamps
});

// Page analytics/stats (optional for tracking)
export const pageViews = pgTable('page_views', {
	id: uuid('id').defaultRandom().primaryKey(),
	pageId: uuid('page_id')
		.notNull()
		.references(() => markdownPages.id, { onDelete: 'cascade' }),
	visitorIp: text('visitor_ip'),
	userAgent: text('user_agent'),
	referer: text('referer'),
	viewedAt: timestamp('viewed_at').defaultNow().notNull()
});
