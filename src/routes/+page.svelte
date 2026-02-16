<script lang="ts">
	import { page } from '$app/state';

	let threshold = $state(50);
	const user = $derived(page.data.user);

	const fakeTweets = [
		{
			handle: '@productivity_guru',
			text: '🧵 I asked ChatGPT to write my morning routine and it CHANGED MY LIFE. Here are 10 AI-powered habits that will 10x your output:',
			aiScore: 94
		},
		{
			handle: '@realperson42',
			text: 'just spilled coffee on my keyboard again. third time this month. i am not a smart man',
			aiScore: 3
		},
		{
			handle: '@thought_leader_ai',
			text: "In today's rapidly evolving landscape, it's crucial to leverage synergistic frameworks that empower stakeholders to drive meaningful innovation across verticals.",
			aiScore: 89
		},
		{
			handle: '@janedoe_dev',
			text: 'spent 4 hours debugging only to find a missing semicolon. gonna go touch grass now',
			aiScore: 7
		},
		{
			handle: '@mindset_ceo',
			text: "Most people don't realize that success is a mindset. Here's what 99% of entrepreneurs get wrong about discipline, focus, and execution:",
			aiScore: 82
		},
		{
			handle: '@techbro_alpha',
			text: 'Absolutely. The intersection of AI and blockchain represents a paradigm shift that will fundamentally reshape how we approach decentralized value creation.',
			aiScore: 91
		}
	];

	function getScoreColor(score: number): string {
		if (score >= 80) return 'text-error';
		if (score >= 50) return 'text-warning';
		return 'text-success';
	}

	function getScoreBg(score: number): string {
		if (score >= 80) return 'bg-error/10';
		if (score >= 50) return 'bg-warning/10';
		return 'bg-success/10';
	}

	function isMuted(score: number): boolean {
		return score >= threshold;
	}
</script>

<svelte:head>
	<title>No Clankers — Filter AI Slop From Your Feed</title>
	<meta
		name="description"
		content="Tired of AI-generated replies flooding your Twitter feed? No Clankers is a Chrome Extension that detects and mutes AI content so you only see real humans."
	/>
</svelte:head>

<!-- HERO — Clean white bg so orange CTA pops with maximum contrast -->
<section
	class="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-base-100 px-4"
>
	<div
		class="pointer-events-none absolute inset-0 bg-gradient-to-b from-base-200/50 to-base-100"
	></div>

	<div class="z-10 max-w-3xl text-center">
		<!-- Indigo badge = trust, authority -->
		<div class="mb-6 badge badge-lg font-semibold badge-secondary">
			Chrome Extension for Twitter / X
		</div>

		<h1 class="mb-6 text-5xl leading-tight font-black text-base-content md:text-7xl">
			Tired of <span class="text-error">AI Slop</span> in Your Feed?
		</h1>

		<p class="mx-auto mb-4 max-w-2xl text-xl text-base-content/60 md:text-2xl">
			Your timeline is drowning in ChatGPT replies, AI-generated threads, and bot-written takes. You
			can feel it. The internet wasn't supposed to be like this.
		</p>

		<p class="mb-8 text-lg font-semibold text-base-content/80 md:text-xl">
			Take back your feed. <span class="text-secondary">Filter out the bots.</span> Keep the humans.
		</p>

		<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
			<!-- Orange CTA = highest-converting color. Large, shadow for depth. -->
			<a href="/#pricing" class="btn px-8 text-lg shadow-lg btn-lg btn-primary">
				Get No Clankers — $19.99/mo
			</a>
			<a href="#demo" class="btn text-lg text-base-content/60 btn-ghost btn-lg">
				See it in action ↓
			</a>
		</div>

		<p class="mt-6 text-sm text-base-content/40">
			Works on Chrome. Install in 30 seconds. Cancel anytime.
		</p>
	</div>
</section>

<!-- PROBLEM — Red accents trigger "this is bad, I need to fix it" -->
<section class="bg-base-200 px-4 py-24">
	<div class="mx-auto max-w-4xl text-center">
		<h2 class="mb-6 text-3xl font-bold text-base-content md:text-5xl">You know the feeling.</h2>
		<p class="mx-auto mb-16 max-w-2xl text-lg text-base-content/60">
			You open Twitter to catch up on real conversations — and instead you get this:
		</p>

		<!-- Red left border on AI slop = subconscious danger signal -->
		<div class="mx-auto grid max-w-xl gap-4 text-left">
			{#each ['"🧵 I asked AI to optimize my life and here are 47 frameworks..."', '"Absolutely. This is a paradigm shift in how we approach innovation."', '"Great question! Here\'s what most people don\'t understand about..."', '"This. So much this. Let me break it down for you in 12 steps:"'] as quote}
				<div class="card border-l-4 border-error/40 bg-base-100">
					<div class="card-body px-5 py-4">
						<p class="text-sm text-base-content/50 italic">{quote}</p>
					</div>
				</div>
			{/each}
		</div>

		<p class="mt-12 text-2xl font-bold text-error">It's everywhere. And it's getting worse.</p>
		<p class="mt-2 text-base-content/60">
			Studies show
			<span class="font-semibold text-base-content">up to 15% of Twitter content</span>
			is now AI-generated — and climbing fast.
		</p>
	</div>
</section>

<!-- HOW IT WORKS — Indigo step numbers = trust & authority -->
<section class="bg-base-100 px-4 py-24">
	<div class="mx-auto max-w-5xl">
		<h2 class="mb-4 text-center text-3xl font-bold text-base-content md:text-5xl">How It Works</h2>
		<p class="mb-16 text-center text-lg text-base-content/60">Three steps. That's it.</p>

		<div class="grid gap-8 md:grid-cols-3">
			<div class="card border border-base-300 bg-base-200 shadow-md">
				<div class="card-body items-center text-center">
					<div
						class="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-2xl font-black text-secondary-content"
					>
						1
					</div>
					<h3 class="card-title text-xl">Install the Extension</h3>
					<p class="text-base-content/60">
						Add No Clankers to Chrome in one click. Takes 30 seconds.
					</p>
				</div>
			</div>

			<div class="card border border-base-300 bg-base-200 shadow-md">
				<div class="card-body items-center text-center">
					<div
						class="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-2xl font-black text-secondary-content"
					>
						2
					</div>
					<h3 class="card-title text-xl">Set Your Threshold</h3>
					<p class="text-base-content/60">
						Use the Turing Threshold slider to choose how strict your AI filter should be.
					</p>
				</div>
			</div>

			<div class="card border border-base-300 bg-base-200 shadow-md">
				<div class="card-body items-center text-center">
					<div
						class="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-2xl font-black text-secondary-content"
					>
						3
					</div>
					<h3 class="card-title text-xl">Scroll in Peace</h3>
					<p class="text-base-content/60">
						AI-generated tweets are automatically muted as you scroll. Only real humans get through.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- INTERACTIVE DEMO — Teal accent slider, red/green scoring = instant gut reaction -->
<section id="demo" class="bg-base-200 px-4 py-24">
	<div class="mx-auto max-w-4xl">
		<h2 class="mb-4 text-center text-3xl font-bold text-base-content md:text-5xl">
			Try the Turing Threshold
		</h2>
		<p class="mx-auto mb-12 max-w-2xl text-center text-lg text-base-content/60">
			Drag the slider to set your tolerance. Watch AI-generated content disappear in real-time.
		</p>

		<!-- Slider — teal accent = fresh, interactive feel -->
		<div class="card mb-8 border border-base-300 bg-base-100 shadow-md">
			<div class="card-body">
				<div class="mb-2 flex items-center justify-between">
					<span class="font-semibold text-base-content">Turing Threshold</span>
					<span class="badge font-mono text-lg badge-lg badge-accent">{threshold}%</span>
				</div>
				<input
					type="range"
					min="0"
					max="100"
					bind:value={threshold}
					class="range w-full range-accent"
				/>
				<div class="mt-1 flex justify-between px-1 text-xs text-base-content/40">
					<span>Likely Human</span>
					<span>Likely AI</span>
				</div>
			</div>
		</div>

		<!-- Fake tweet feed — red/green scores = visceral good/bad understanding -->
		<div class="grid gap-3">
			{#each fakeTweets as tweet}
				<div
					class="card border border-base-300 bg-base-100 transition-all duration-300"
					class:opacity-10={isMuted(tweet.aiScore)}
					class:scale-[0.98]={isMuted(tweet.aiScore)}
					class:blur-xs={isMuted(tweet.aiScore)}
				>
					<div class="card-body px-5 py-4">
						<div class="flex items-center justify-between">
							<span class="text-sm font-semibold text-base-content/70">{tweet.handle}</span>
							<div class="flex items-center gap-2">
								<span class="text-xs text-base-content/40">AI Score:</span>
								<span
									class="badge border-0 font-mono text-sm badge-sm font-bold {getScoreBg(
										tweet.aiScore
									)} {getScoreColor(tweet.aiScore)}"
								>
									{tweet.aiScore}%
								</span>
								{#if isMuted(tweet.aiScore)}
									<span class="badge badge-sm badge-error">MUTED</span>
								{/if}
							</div>
						</div>
						<p class="mt-1 text-sm text-base-content/60">{tweet.text}</p>
					</div>
				</div>
			{/each}
		</div>

		<p class="mt-6 text-center text-sm text-base-content/40">
			This is a simulation. Actual AI detection is powered by our backend scoring engine.
		</p>
	</div>
</section>

<!-- SOCIAL PROOF — Indigo numbers = authoritative, trustworthy data -->
<section class="bg-base-100 px-4 py-20">
	<div class="mx-auto max-w-4xl">
		<div class="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
			<div>
				<p class="text-4xl font-black text-secondary">50K+</p>
				<p class="mt-1 text-sm text-base-content/50">Tweets scanned daily</p>
			</div>
			<div>
				<p class="text-4xl font-black text-secondary">93%</p>
				<p class="mt-1 text-sm text-base-content/50">Detection accuracy</p>
			</div>
			<div>
				<p class="text-4xl font-black text-secondary">&lt;200ms</p>
				<p class="mt-1 text-sm text-base-content/50">Avg response time</p>
			</div>
			<div>
				<p class="text-4xl font-black text-error">0</p>
				<p class="mt-1 text-sm text-base-content/50">Clankers tolerated</p>
			</div>
		</div>
	</div>
</section>

<!-- FEATURES — Colored icon backgrounds = each benefit "feels" different -->
<section class="bg-base-200 px-4 py-24">
	<div class="mx-auto max-w-5xl">
		<h2 class="mb-16 text-center text-3xl font-bold text-base-content md:text-5xl">
			Built for People Who Are Over It
		</h2>

		<div class="grid gap-6 md:grid-cols-2">
			<div class="card border border-base-300 bg-base-100">
				<div class="card-body">
					<div class="mb-1 flex items-center gap-3">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-xl"
						>
							🎯
						</div>
						<h3 class="card-title">Adjustable AI Detection</h3>
					</div>
					<p class="text-base-content/60">
						Set your own Turing Threshold. Some people want zero tolerance; others just want to
						catch the worst offenders. You decide.
					</p>
				</div>
			</div>

			<div class="card border border-base-300 bg-base-100">
				<div class="card-body">
					<div class="mb-1 flex items-center gap-3">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-xl"
						>
							⚡
						</div>
						<h3 class="card-title">Real-Time Filtering</h3>
					</div>
					<p class="text-base-content/60">
						Tweets are scored as you scroll. No page reloads, no lag. AI content fades out before
						you even notice it.
					</p>
				</div>
			</div>

			<div class="card border border-base-300 bg-base-100">
				<div class="card-body">
					<div class="mb-1 flex items-center gap-3">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-success/15 text-xl"
						>
							🔒
						</div>
						<h3 class="card-title">Privacy First</h3>
					</div>
					<p class="text-base-content/60">
						We only analyze tweet text. No tracking, no data selling, no reading your DMs. Your
						browsing stays yours.
					</p>
				</div>
			</div>

			<div class="card border border-base-300 bg-base-100">
				<div class="card-body">
					<div class="mb-1 flex items-center gap-3">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15 text-xl"
						>
							🧠
						</div>
						<h3 class="card-title">Always Learning</h3>
					</div>
					<p class="text-base-content/60">
						Our detection engine improves constantly. As AI-generated content evolves, so does our
						ability to catch it.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- PRICING — Orange border + CTA = maximum urgency & conversion -->
<section id="pricing" class="bg-base-100 px-4 py-24">
	<div class="mx-auto max-w-lg text-center">
		<h2 class="mb-4 text-3xl font-bold text-base-content md:text-5xl">One Plan. No BS.</h2>
		<p class="mb-12 text-lg text-base-content/60">
			No tiers, no upsells, no "enterprise" plans. Just a clean feed.
		</p>

		<div class="card border-2 border-primary bg-base-100 shadow-xl">
			<div class="card-body items-center py-10 text-center">
				<div class="mb-2 badge badge-primary">MOST POPULAR (it's the only one)</div>
				<h3 class="text-2xl font-bold text-base-content">No Clankers Pro</h3>
				<div class="my-4">
					<span class="text-6xl font-black text-base-content">$19.99</span>
					<span class="text-base-content/50">/month</span>
				</div>

				<!-- Green checkmarks = safety, "you're getting something good" -->
				<ul class="mb-8 w-full max-w-xs space-y-3 text-left">
					<li class="flex items-center gap-3">
						<span class="text-lg font-bold text-success">✓</span>
						<span class="text-base-content/80">Unlimited tweet scanning</span>
					</li>
					<li class="flex items-center gap-3">
						<span class="text-lg font-bold text-success">✓</span>
						<span class="text-base-content/80">Adjustable Turing Threshold</span>
					</li>
					<li class="flex items-center gap-3">
						<span class="text-lg font-bold text-success">✓</span>
						<span class="text-base-content/80">Real-time muting as you scroll</span>
					</li>
					<li class="flex items-center gap-3">
						<span class="text-lg font-bold text-success">✓</span>
						<span class="text-base-content/80">AI score overlay on every tweet</span>
					</li>
					<li class="flex items-center gap-3">
						<span class="text-lg font-bold text-success">✓</span>
						<span class="text-base-content/80">Cancel anytime — no lock-in</span>
					</li>
				</ul>

				<!-- Big orange CTA — the conversion moment -->
				<a href="/auth/login" class="btn w-full max-w-xs text-lg shadow-lg btn-lg btn-primary">
					Get Started Now
				</a>
				<p class="mt-3 text-xs text-base-content/40">Secure checkout via Polar. Cancel anytime.</p>
			</div>
		</div>
	</div>
</section>

<!-- FAQ — Neutral, clean. No color distraction from CTA above. -->
<section class="bg-base-200 px-4 py-24">
	<div class="mx-auto max-w-2xl">
		<h2 class="mb-12 text-center text-3xl font-bold text-base-content md:text-5xl">
			Questions? Answers.
		</h2>

		<div class="space-y-2">
			<div class="collapse-arrow collapse border border-base-300 bg-base-100">
				<input type="radio" name="faq" checked />
				<div class="collapse-title font-semibold">How does No Clankers detect AI content?</div>
				<div class="collapse-content text-base-content/60">
					<p>
						Our backend scoring engine analyzes tweet text for patterns typical of AI-generated
						content — things like phrasing, structure, and linguistic fingerprints that LLMs leave
						behind. Each tweet gets a 0-100 AI probability score.
					</p>
				</div>
			</div>

			<div class="collapse-arrow collapse border border-base-300 bg-base-100">
				<input type="radio" name="faq" />
				<div class="collapse-title font-semibold">Will it accidentally hide real human tweets?</div>
				<div class="collapse-content text-base-content/60">
					<p>
						That's what the Turing Threshold is for. Set it high (80%+) and only the most obvious AI
						slop gets muted. Set it low and you catch more, but might get some false positives.
						You're in full control.
					</p>
				</div>
			</div>

			<div class="collapse-arrow collapse border border-base-300 bg-base-100">
				<input type="radio" name="faq" />
				<div class="collapse-title font-semibold">Does it work on X (formerly Twitter)?</div>
				<div class="collapse-content text-base-content/60">
					<p>
						Yes — X, Twitter, whatever we're calling it this week. The extension works on
						twitter.com and x.com.
					</p>
				</div>
			</div>

			<div class="collapse-arrow collapse border border-base-300 bg-base-100">
				<input type="radio" name="faq" />
				<div class="collapse-title font-semibold">Can I cancel anytime?</div>
				<div class="collapse-content text-base-content/60">
					<p>
						Absolutely. No contracts, no lock-in. Cancel your subscription with one click and you
						won't be charged again. We use Polar for payments — simple and transparent.
					</p>
				</div>
			</div>

			<div class="collapse-arrow collapse border border-base-300 bg-base-100">
				<input type="radio" name="faq" />
				<div class="collapse-title font-semibold">Does this sell my data?</div>
				<div class="collapse-content text-base-content/60">
					<p>
						No. We analyze tweet text to generate a score. That's it. We don't track your browsing,
						we don't store your timeline, and we definitely don't sell anything to anyone.
					</p>
				</div>
			</div>

			<div class="collapse-arrow collapse border border-base-300 bg-base-100">
				<input type="radio" name="faq" />
				<div class="collapse-title font-semibold">Why $19.99/month?</div>
				<div class="collapse-content text-base-content/60">
					<p>
						Every tweet you scroll past gets analyzed by our AI detection engine on the server side
						— that costs real money to run. The subscription keeps the lights on and the detection
						accurate, with no ads and no data selling.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- FINAL CTA — Orange button on clean white = maximum pop, last conversion push -->
<section class="bg-base-100 px-4 py-24">
	<div class="mx-auto max-w-3xl text-center">
		<h2 class="mb-6 text-3xl font-bold text-base-content md:text-5xl">
			Your Feed. Real People. <span class="text-primary">No Clankers.</span>
		</h2>
		<p class="mx-auto mb-8 max-w-xl text-lg text-base-content/60">
			Stop scrolling through AI-generated noise. Install No Clankers and get back to the internet
			you actually want.
		</p>
		<a href="/auth/login" class="btn px-10 text-lg shadow-lg btn-lg btn-primary">
			Get No Clankers — $19.99/mo
		</a>
		<p class="mt-4 text-sm text-base-content/40">
			Chrome Extension · 30-second install · Cancel anytime
		</p>
	</div>
</section>

<!-- FOOTER -->
<footer class="bg-base-300 px-4 py-10">
	<div class="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 md:flex-row">
		<p class="text-sm text-base-content/40">
			&copy; {new Date().getFullYear()} No Clankers. All rights reserved.
		</p>
		<div class="flex gap-6 text-sm text-base-content/40">
			{#if user}
				<a href="/dashboard" class="transition-colors hover:text-base-content">Dashboard</a>
			{:else}
				<a href="/auth/login" class="transition-colors hover:text-base-content">Sign In</a>
			{/if}
		</div>
	</div>
</footer>
