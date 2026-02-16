<script lang="ts">
	import { onMount } from 'svelte';
	import { authClient } from '$lib/auth-client';

	let error = $state('');

	onMount(async () => {
		const result = await authClient.checkout({ slug: 'pro' });
		if (result.error) {
			error = 'Something went wrong starting checkout. Please try again.';
		}
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-base-200">
	<div class="card w-full max-w-sm bg-base-100 shadow-xl">
		<div class="card-body items-center text-center">
			{#if error}
				<div class="alert alert-error">
					<span>{error}</span>
				</div>
				<a href="/auth/login?redirect=checkout" class="btn btn-primary mt-4">Try Again</a>
			{:else}
				<span class="loading loading-spinner loading-lg text-primary"></span>
				<p class="mt-4 text-base-content/60">Redirecting to checkout...</p>
			{/if}
		</div>
	</div>
</div>
