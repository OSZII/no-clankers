import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { polar, checkout, portal, webhooks } from '@polar-sh/better-auth';
import { Polar } from '@polar-sh/sdk';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { subscription } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

const polarClient = new Polar({
	accessToken: env.POLAR_ACCESS_TOKEN,
	server: (env.POLAR_SERVER as 'sandbox' | 'production') ?? 'sandbox'
});

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
						const userId = (sub as any).customer?.metadata?.betterauth_user_id;
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
						const userId = (sub as any).customer?.metadata?.betterauth_user_id;
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
					onSubscriptionCanceled: async (payload) => {
						const sub = payload.data;
						const userId = (sub as any).customer?.metadata?.betterauth_user_id;
						if (!userId) return;

						await db
							.update(subscription)
							.set({
								status: 'canceled',
								canceledAt: sub.canceledAt ? new Date(sub.canceledAt) : new Date(),
								updatedAt: new Date()
							})
							.where(eq(subscription.userId, userId));
					},
					onSubscriptionRevoked: async (payload) => {
						const sub = payload.data;
						const userId = (sub as any).customer?.metadata?.betterauth_user_id;
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
						const userId = (sub as any).customer?.metadata?.betterauth_user_id;
						if (!userId) return;

						await db
							.update(subscription)
							.set({
								status: 'active',
								canceledAt: null,
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
