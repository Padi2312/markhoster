import { initAdminUser } from '$lib/init';
import logger from '$lib/logger';
import { db } from '$lib/server/db';
import { redirect, type Handle, type ServerInit } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { handle as authHandle } from './auth';

export const init: ServerInit = async () => {
	logger.info('Running database migrations');
	if (!db) {
		throw new Error('Database connection is not initialized');
	}
	await migrate(db, { migrationsFolder: 'drizzle' });
	await initAdminUser();
	logger.info('Database migrations completed successfully');
};

/**
 * Check if the user is authenticated and has appropriate permissions.
 * If not, redirect to the login page or show appropriate error.
 */
const authorizationHandle: Handle = async ({ event, resolve }) => {
	const session = await event.locals.auth();

	if (!event.url.pathname.startsWith('/admin') && !event.url.pathname.startsWith('/api')) {
		return resolve(event);
	}

	if (
		!session?.user?.id &&
		(event.url.pathname.startsWith('/admin') || event.url.pathname.startsWith('/login'))
	) {
		return redirect(302, '/admin');
	}

	return resolve(event);
};

export const handle: Handle = sequence(authHandle, authorizationHandle);
