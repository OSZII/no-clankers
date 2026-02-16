import { pgTable, serial, integer, text } from 'drizzle-orm/pg-core';

export const cache = pgTable('cache', {
	hash: text('hash').primaryKey(),
	score: integer('score').notNull()
});

export * from './auth.schema';
export * from './subscription.schema';
