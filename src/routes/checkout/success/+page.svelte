<script lang="ts">
	import { page } from '$app/state';

	const user = $derived(page.data.user);
	const subscriptionActive = $derived(page.data.subscriptionActive);
</script>

<div class="flex min-h-screen items-center justify-center bg-base-200 px-4">
	<div class="card w-full max-w-md bg-base-100 shadow-xl">
		<div class="card-body items-center text-center">
			{#if subscriptionActive}
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-4xl"
				>
					✓
				</div>
				<h1 class="card-title text-3xl">You're In!</h1>
				<p class="text-base-content/60">
					{#if user}
						Welcome, {user.name}! Your No Clankers subscription is active.
					{:else}
						Your No Clankers subscription is active.
					{/if}
				</p>

				<div class="divider"></div>

				<h2 class="text-lg font-semibold text-base-content">What's next?</h2>
				<ol class="steps steps-vertical w-full text-left">
					<li class="step step-primary">
						<span class="text-sm text-base-content/70">Install the Chrome Extension</span>
					</li>
					<li class="step">
						<span class="text-sm text-base-content/70">Set your Turing Threshold</span>
					</li>
					<li class="step">
						<span class="text-sm text-base-content/70">Scroll Twitter in peace</span>
					</li>
				</ol>

				<div class="card-actions mt-6 w-full flex-col gap-2">
					<a href="/dashboard" class="btn w-full btn-primary">Go to Dashboard</a>
					<a href="/" class="btn w-full btn-ghost">Back to Home</a>
				</div>
			{:else}
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warning/15 text-4xl"
				>
					...
				</div>
				<h1 class="card-title text-2xl">Processing your payment</h1>
				<p class="text-base-content/60">
					Your subscription is being set up. This usually takes a few seconds.
				</p>
				<div class="card-actions mt-6 w-full flex-col gap-2">
					<a href="/checkout/success" class="btn w-full btn-primary">Refresh</a>
					<a href="/dashboard" class="btn w-full btn-ghost">Go to Dashboard</a>
				</div>
			{/if}
		</div>
	</div>
</div>
