import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { bearer } from 'better-auth/plugins/bearer';
import { polar, checkout, portal, webhooks } from '@polar-sh/better-auth';
import { Polar } from '@polar-sh/sdk';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { subscription } from '$lib/server/db/schema';
import { eq, and, or, gt } from 'drizzle-orm';

const polarClient = new Polar({
	accessToken: env.POLAR_ACCESS_TOKEN,
	server: (env.POLAR_SERVER as 'sandbox' | 'production') ?? 'sandbox'
});

/**
 * Extract the Better Auth user ID from a Polar webhook subscription payload.
 * Returns `undefined` (and logs a warning) when the metadata is missing.
 */
function getUserIdFromWebhook(sub: { id: string; customerId: string } & Record<string, any>): string | undefined {
	const userId: string | undefined = sub.customer?.metadata?.betterauth_user_id;
	if (!userId) {
		console.warn(
			`[polar-webhook] Missing betterauth_user_id in customer metadata for subscription ${sub.id} (customerId: ${sub.customerId}). Webhook will be skipped.`
		);
	}
	return userId;
}

/**
 * Check whether a user currently has an active subscription.
 * A subscription is considered active if:
 *   - status is 'active', OR
 *   - status is 'canceled' but `currentPeriodEnd` is still in the future
 *     (the user paid for the current billing period).
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
	const now = new Date();
	const sub = await db.query.subscription.findFirst({
		where: and(
			eq(subscription.userId, userId),
			or(
				eq(subscription.status, 'active'),
				and(eq(subscription.status, 'canceled'), gt(subscription.currentPeriodEnd, now))
			)
		)
	});
	return !!sub;
}

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: false },
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID as string,
			clientSecret: env.GOOGLE_CLIENT_SECRET as string,
			accessType: 'offline',
			prompt: 'select_account consent'
		}
	},
	plugins: [
		bearer(),
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			use: [
				checkout({
					products: [{ productId: env.POLAR_PRODUCT_ID as string, slug: 'pro' }],
					successUrl: '/checkout/success',
					authenticatedUsersOnly: true
				}),
				portal(),
				webhooks({
					secret: env.POLAR_WEBHOOK_SECRET as string,
					onSubscriptionCreated: async (payload) => {
						const sub = payload.data;
						const userId = getUserIdFromWebhook(sub as any);
						if (!userId) return;

						await db
							.insert(subscription)
							.values({
								id: sub.id,
								userId,
								polarCustomerId: sub.customerId,
								productId: sub.productId,
								status: sub.status,
								currentPeriodEnd: sub.currentPeriodEnd
									? new Date(sub.currentPeriodEnd)
									: null,
								createdAt: new Date(),
								updatedAt: new Date()
							})
							.onConflictDoUpdate({
								target: subscription.userId,
								set: {
									id: sub.id,
									polarCustomerId: sub.customerId,
									productId: sub.productId,
									status: sub.status,
									currentPeriodEnd: sub.currentPeriodEnd
										? new Date(sub.currentPeriodEnd)
										: null,
									updatedAt: new Date()
								}
							});
					},
					onSubscriptionActive: async (payload) => {
						const sub = payload.data;
						const userId = getUserIdFromWebhook(sub as any);
						if (!userId) return;

						await db
							.insert(subscription)
							.values({
								id: sub.id,
								userId,
								polarCustomerId: sub.customerId,
								productId: sub.productId,
								status: 'active',
								currentPeriodEnd: sub.currentPeriodEnd
									? new Date(sub.currentPeriodEnd)
									: null,
								createdAt: new Date(),
								updatedAt: new Date()
							})
							.onConflictDoUpdate({
								target: subscription.userId,
								set: {
									status: 'active',
									currentPeriodEnd: sub.currentPeriodEnd
										? new Date(sub.currentPeriodEnd)
										: null,
									canceledAt: null,
									updatedAt: new Date()
								}
							});
					},
					onSubscriptionUpdated: async (payload) => {
						const sub = payload.data;
						const userId = getUserIdFromWebhook(sub as any);
						if (!userId) return;

						await db
							.update(subscription)
							.set({
								status: sub.status,
								currentPeriodEnd: sub.currentPeriodEnd
									? new Date(sub.currentPeriodEnd)
									: null,
								updatedAt: new Date()
							})
							.where(eq(subscription.userId, userId));
					},
					onSubscriptionCanceled: async (payload) => {
						const sub = payload.data;
						const userId = getUserIdFromWebhook(sub as any);
						if (!userId) return;

						await db
							.update(subscription)
							.set({
								status: 'canceled',
								canceledAt: sub.canceledAt ? new Date(sub.canceledAt) : new Date(),
								currentPeriodEnd: sub.currentPeriodEnd
									? new Date(sub.currentPeriodEnd)
									: null,
								updatedAt: new Date()
							})
							.where(eq(subscription.userId, userId));
					},
					onSubscriptionRevoked: async (payload) => {
						const sub = payload.data;
						const userId = getUserIdFromWebhook(sub as any);
						if (!userId) return;

						await db
							.update(subscription)
							.set({
								status: 'revoked',
								updatedAt: new Date()
							})
							.where(eq(subscription.userId, userId));
					},
					onSubscriptionUncanceled: async (payload) => {
						const sub = payload.data;
						const userId = getUserIdFromWebhook(sub as any);
						if (!userId) return;

						await db
							.update(subscription)
							.set({
								status: 'active',
								canceledAt: null,
								updatedAt: new Date()
							})
							.where(eq(subscription.userId, userId));
					},
					onOrderRefunded: async (payload) => {
						const order = payload.data;
						const userId = (order as any).customer?.metadata?.betterauth_user_id;
						if (!userId) {
							console.warn(
								`[polar-webhook] Missing betterauth_user_id in customer metadata for refunded order ${order.id}. Webhook will be skipped.`
							);
							return;
						}

						await db
							.update(subscription)
							.set({
								status: 'revoked',
								updatedAt: new Date()
							})
							.where(eq(subscription.userId, userId));
					}
				})
			]
		}),
		sveltekitCookies(getRequestEvent) // keep last
	]
});
