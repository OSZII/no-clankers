import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const subscription = pgTable(
	'subscription',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.unique()
			.references(() => user.id, { onDelete: 'cascade' }),
		polarCustomerId: text('polar_customer_id'),
		productId: text('product_id').notNull(),
		status: text('status').default('incomplete').notNull(),
		currentPeriodEnd: timestamp('current_period_end'),
		canceledAt: timestamp('canceled_at'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [index('subscription_userId_idx').on(table.userId), index('subscription_status_idx').on(table.status)]
);
