# Payment & Subscription – Manual Test Checklist

## Prerequisites

- [ ] Polar.sh sandbox environment configured
- [ ] Google OAuth credentials set up
- [ ] All env vars populated (see `.env.example`)
- [ ] Database migrated (`npm run db:push`)

---

## 1. Checkout Flow (Happy Path)

- [ ] Unauthenticated user visiting `/checkout` is redirected to `/auth/login?redirect=checkout`
- [ ] After Google sign-in, user is redirected back to `/checkout`
- [ ] Checkout page shows loading spinner and redirects to Polar hosted checkout
- [ ] Completing payment on Polar redirects to `/checkout/success`
- [ ] Success page shows "You're In!" with the user's name
- [ ] Subscription record exists in DB with `status = 'active'` and a valid `currentPeriodEnd`

## 2. Checkout Guards

- [ ] Active subscriber visiting `/checkout` is redirected to `/dashboard`
- [ ] Canceled subscriber still within billing period visiting `/checkout` is redirected to `/dashboard` (not allowed to double-purchase)
- [ ] Canceled subscriber past `currentPeriodEnd` visiting `/checkout` can start a new checkout
- [ ] Revoked subscriber visiting `/checkout` can start a new checkout
- [ ] User with `status = 'incomplete'` visiting `/checkout` can proceed to checkout

## 3. Dashboard Access

- [ ] Unauthenticated user visiting `/dashboard` is redirected to `/auth/login`
- [ ] Authenticated user with no subscription visiting `/dashboard` is redirected to `/checkout`
- [ ] Active subscriber can access `/dashboard`
- [ ] Canceled subscriber still within billing period can access `/dashboard`
- [ ] Canceled subscriber past `currentPeriodEnd` visiting `/dashboard` is redirected to `/checkout`
- [ ] Revoked subscriber visiting `/dashboard` is redirected to `/checkout`

## 4. Subscribe-and-Cancel Abuse Case

- [ ] Subscribe, then immediately cancel via Polar portal
- [ ] Verify DB: `status = 'canceled'`, `canceledAt` is set, `currentPeriodEnd` is still in the future
- [ ] Verify user can still access `/dashboard` (paid for the period)
- [ ] Verify user is blocked from re-purchasing at `/checkout` (redirected to dashboard)
- [ ] Wait for period to end (or simulate): `onSubscriptionRevoked` webhook fires
- [ ] Verify DB: `status = 'revoked'`
- [ ] Verify user is now redirected from `/dashboard` to `/checkout`
- [ ] Verify user can now start a new checkout

## 5. Uncancel Flow

- [ ] Subscribe, cancel, then uncancel via Polar portal before period ends
- [ ] Verify DB: `status = 'active'`, `canceledAt = null`
- [ ] Verify user can access `/dashboard`
- [ ] Verify user is blocked from `/checkout` (redirected to dashboard)

## 6. Subscription Renewal

- [ ] Let an active subscription reach its period end
- [ ] Verify `onSubscriptionUpdated` webhook fires with new `currentPeriodEnd`
- [ ] Verify DB: `currentPeriodEnd` is updated to the new period
- [ ] Verify user retains access to `/dashboard` without interruption

## 7. Refund / Chargeback

- [ ] Issue a refund for an active subscriber via Polar dashboard
- [ ] Verify `onOrderRefunded` webhook fires
- [ ] Verify DB: `status = 'revoked'`
- [ ] Verify user is redirected from `/dashboard` to `/checkout`
- [ ] Verify user can start a new checkout

## 8. Webhook Edge Cases

- [ ] Send a webhook with missing `betterauth_user_id` in customer metadata
- [ ] Verify server logs show `[polar-webhook] Missing betterauth_user_id...` warning
- [ ] Verify no DB changes occur (webhook is skipped gracefully)
- [ ] Send a webhook with invalid signature
- [ ] Verify 400 response with "Webhook Error" message
- [ ] Send duplicate `onSubscriptionCreated` webhooks for the same user
- [ ] Verify `onConflictDoUpdate` handles it (no crash, DB stays consistent)

## 9. Checkout Success Page

- [ ] Navigate directly to `/checkout/success` without having paid
- [ ] Verify it shows "Processing your payment" (not the success state)
- [ ] Verify "Refresh" button reloads the page
- [ ] Complete a real checkout and land on `/checkout/success`
- [ ] Verify it shows "You're In!" with next steps
- [ ] Unauthenticated user visiting `/checkout/success` is redirected to `/auth/login`

## 10. Multi-Account / Re-subscribe

- [ ] User with a revoked subscription signs up with a different Google account
- [ ] Verify new account can complete checkout independently
- [ ] Original account with revoked status can also re-subscribe
- [ ] Verify `onConflictDoUpdate` on `subscription.userId` handles the re-subscribe correctly (old subscription ID is replaced)

## 11. Polar Portal Access

- [ ] Authenticated subscriber can access the Polar customer portal
- [ ] Portal shows current subscription status, billing info, and cancel option
- [ ] Unauthenticated user cannot access the portal endpoint (session required)
