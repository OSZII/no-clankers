<script lang="ts">
	import { onMount } from 'svelte';

	let { data } = $props();
	let status = $state<'sending' | 'success' | 'fallback' | 'error'>('sending');
	let errorMessage = $state('');

	// The extension ID — update this when you publish the extension
	const EXTENSION_ID = 'YOUR_EXTENSION_ID_HERE';

	onMount(async () => {
		const message = {
			type: 'NO_CLANKERS_AUTH',
			token: data.token,
			user: data.user,
			subscription: data.subscription
		};

		// Try chrome.runtime.sendMessage first (externally_connectable)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const chromeGlobal = (globalThis as any).chrome;
		if (chromeGlobal?.runtime?.sendMessage) {
			try {
				await chromeGlobal.runtime.sendMessage(EXTENSION_ID, message);
				status = 'success';
				return;
			} catch {
				// Extension may not be installed or ID mismatch — fall through
			}
		}

		// Fallback: window.postMessage (content script will forward)
		window.postMessage(message, '*');
		status = 'fallback';

		// Give the content script a moment to pick it up
		setTimeout(() => {
			if (status === 'fallback') {
				status = 'success';
			}
		}, 1500);
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-base-200">
	<div class="card w-full max-w-sm bg-base-100 shadow-xl">
		<div class="card-body items-center text-center">
			{#if status === 'sending'}
				<span class="loading loading-lg loading-spinner text-primary"></span>
				<p class="mt-4 text-base-content/70">Connecting to extension...</p>
			{:else if status === 'success' || status === 'fallback'}
				<div class="text-success">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mx-auto h-16 w-16"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h2 class="mt-2 card-title">Connected!</h2>
				<p class="text-base-content/60">You can close this tab and return to the extension.</p>
			{:else if status === 'error'}
				<div class="text-error">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mx-auto h-16 w-16"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h2 class="mt-2 card-title text-error">Connection Failed</h2>
				<p class="text-base-content/60">
					{errorMessage || 'Could not connect to the extension. Make sure it is installed.'}
				</p>
				<div class="mt-4 card-actions">
					<button class="btn btn-primary" onclick={() => location.reload()}>Try Again</button>
				</div>
			{/if}
		</div>
	</div>
</div>
