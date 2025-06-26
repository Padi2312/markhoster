import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';

export const initAdminUser = async () => {
    const email = env.ADMIN_EMAIL;
    const password = env.ADMIN_PASSWORD;
    const name = env.ADMIN_NAME ?? 'Admin';

    if (!email || !password) {
        throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables');
    }

    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existing.length === 0) {
        const hashedPassword = await argon2.hash(password);
        await db.insert(users).values({
            email,
            password: hashedPassword,
            name
        });
    }
};
