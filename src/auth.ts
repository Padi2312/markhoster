import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { accounts, sessions, users } from '$lib/server/db/schema';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { SvelteKitAuth, type DefaultSession } from '@auth/sveltekit';
import Credentials from '@auth/sveltekit/providers/credentials';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';

declare module '@auth/sveltekit' {
	interface Session {
		user: {
			id: string;
			/**
			 * By default, TypeScript merges new interface properties and overwrites existing ones.
			 * In this case, the default session user properties will be overwritten,
			 * with the new ones defined above. To keep the default session user properties,
			 * you need to add them back into the newly declared interface.
			 */
		} & DefaultSession['user'];
	}
}

const providers = [
	// Keycloak({
	// 	clientId: env.KEYCLOAK_CLIENT_ID,
	// 	clientSecret: env.KEYCLOAK_CLIENT_SECRET,
	// 	issuer: env.KEYCLOAK_ISSUER
	// }),
	// Email/Password authentication
	Credentials({
		name: 'credentials',
		credentials: {
			email: { label: 'Email', type: 'email' },
			password: { label: 'Password', type: 'password' }
		},
		async authorize(credentials) {
			if (!credentials?.email || !credentials?.password) return null;

			const user = await db.query.users.findFirst({
				where: eq(users.email, credentials.email as string)
			});

			if (!user || !user.password) return null;

			const validPassword = await argon2.verify(user.password, credentials.password as string);
			if (!validPassword) return null;

			return {
				id: user.id,
				email: user.email,
				name: user.name
			};
		}
	})
];

export const { handle } = SvelteKitAuth({
	providers,
	adapter: DrizzleAdapter(db, {
		usersTable: users,
		accountsTable: accounts,
		sessionsTable: sessions
	}),
	useSecureCookies: env.NODE_ENV === 'production',
	trustHost: true,
	session: {
		strategy: 'jwt'
	},
	callbacks: {
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
			}
			return session;
		},
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		}
	}
});
