<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children, data } = $props();
	const user = $derived(data.user);

	let isDark = $state(false);

	onMount(() => {
		isDark = localStorage.getItem('theme') === 'noclankers-dark';
		document.documentElement.setAttribute('data-theme', isDark ? 'noclankers-dark' : 'noclankers');
	});

	function toggleTheme() {
		isDark = !isDark;
		const theme = isDark ? 'noclankers-dark' : 'noclankers';
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<!-- Navbar — sticky, glass effect -->
<nav class="navbar fixed top-0 z-50 border-b border-base-300/50 bg-base-100/80 backdrop-blur-lg">
	<div class="mx-auto flex w-full max-w-6xl items-center justify-between px-4">
		<!-- Logo -->
		<a href="/" class="text-xl font-black text-base-content"> No Clankers </a>

		<!-- Desktop nav links -->
		<div class="hidden items-center gap-1 md:flex">
			<a href="#demo" class="btn text-base-content/70 btn-ghost btn-sm">Demo</a>
			<a href="/#pricing" class="btn text-base-content/70 btn-ghost btn-sm">Pricing</a>
		</div>

		<!-- Right side: theme toggle + login + CTA -->
		<div class="flex items-center gap-2">
			<!-- Theme switcher -->
			<button
				onclick={toggleTheme}
				class="btn btn-square btn-ghost btn-sm"
				aria-label="Toggle theme"
			>
				{#if isDark}
					<!-- Sun icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="12" cy="12" r="5" />
						<line x1="12" y1="1" x2="12" y2="3" />
						<line x1="12" y1="21" x2="12" y2="23" />
						<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
						<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
						<line x1="1" y1="12" x2="3" y2="12" />
						<line x1="21" y1="12" x2="23" y2="12" />
						<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
						<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
					</svg>
				{:else}
					<!-- Moon icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
					</svg>
				{/if}
			</button>

			<!-- Login / Dashboard -->
			{#if user}
				<a href="/dashboard" class="btn hidden btn-ghost btn-sm sm:inline-flex">Dashboard</a>
			{:else}
				<a href="/auth/login" class="btn hidden btn-ghost btn-sm sm:inline-flex">Sign In</a>
			{/if}

			<!-- CTA -->
			<a href="/#pricing" class="btn shadow-md btn-sm btn-primary">Get Started</a>
		</div>
	</div>
</nav>

<!-- Spacer so content doesn't hide behind fixed navbar -->
<div class="h-16"></div>

{@render children()}

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>
			{locale}
		</a>
	{/each}
</div>
