import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

const databaseURL = `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:5432/${env.POSTGRES_DB}`;
export const db = drizzle(databaseURL, { schema });
