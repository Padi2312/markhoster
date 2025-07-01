import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';

export const initAdminUser = async () => {
	const email = env.ADMIN_EMAIL;
	const password = env.ADMIN_PASSWORD;
	const name = 'Admin';

	if (!email || !password) {
		throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables');
	}

	// Check if the admin user already exists if not, create it
	// if email or password is different, update it
	const availableUsers = await db.select().from(users);
	if (availableUsers.length > 0) {
		// Just take the first user as the admin user
		const existingUser = availableUsers[0];
		if (existingUser) {
			await db
				.update(users)
				.set({
					email,
					password: await argon2.hash(password),
					name
				})
				.where(eq(users.id, existingUser.id));
		}
	} else {
		const hashedPassword = await argon2.hash(password);
		await db.insert(users).values({
			email,
			password: hashedPassword,
			name
		});
	}
};
