<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-base-200">
	<div class="card w-full max-w-sm bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl">Hi, {data.user.name}!</h2>
			<p class="text-base-content/60">Your user ID is {data.user.id}.</p>
			<div class="card-actions mt-4">
				<form method="post" action="?/signOut" use:enhance class="w-full">
					<button class="btn btn-primary w-full">Sign out</button>
				</form>
			</div>
		</div>
	</div>
</div>
