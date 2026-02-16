<script lang="ts">
	import { authClient } from '$lib/auth-client';

	let loading = $state(false);

	async function signInWithGoogle() {
		loading = true;
		await authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard' });
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-base-200">
	<div class="card w-full max-w-sm bg-base-100 shadow-xl">
		<div class="card-body items-center text-center">
			<h2 class="card-title text-2xl">Sign in</h2>
			<p class="text-base-content/60">Continue with your Google account</p>
			<div class="mt-4 card-actions w-full">
				<button class="btn w-full btn-primary" onclick={signInWithGoogle} disabled={loading}>
					{#if loading}
						<span class="loading loading-spinner"></span>
					{/if}
					Sign in with Google
				</button>
			</div>
		</div>
	</div>
</div>
