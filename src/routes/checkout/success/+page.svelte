<script lang="ts">
	import { page } from '$app/state';

	const user = $derived(page.data.user);
</script>

<div class="flex min-h-screen items-center justify-center bg-base-200 px-4">
	<div class="card w-full max-w-md bg-base-100 shadow-xl">
		<div class="card-body items-center text-center">
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
		</div>
	</div>
</div>
