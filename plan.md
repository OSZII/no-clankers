🚀 Executive Summary
No Clankers is a browser-based firewall for human consumption. It consists of a paid Chrome Extension ($19.99/mo) that uses a slider interface to set a "Turing Threshold."

The Flow: The user sets a tolerance (e.g., 80%). As they scroll Twitter, the extension scrapes text, sends it to your SvelteKit API, and receives a probability score. If the score exceeds the tolerance, the text is essentially muted.

The Moat: The SvelteKit backend acts as the gatekeeper, validating the Polar.sh subscription before processing the AI detection request, ensuring only paying users generate server costs.

🛠 Tech Stack Confirmation
Web Framework: SvelteKit (SSR + API Routes).

Styling: TailwindCSS v4 + DaisyUI v5.

Auth: Better Auth (Drizzle adapter, Google OAuth, SvelteKit cookies plugin).

Database: Drizzle ORM + PostgreSQL.

Payments: Polar.sh.

i18n: Paraglide JS (Inlang).

Browser: Chrome Extension (Manifest V3).

📋 Detailed Implementation Plan
Phase 1: The SvelteKit Backend & Database
This is the "Brain" and the "Bouncer."

Database Schema (Drizzle):

users: stores polar_customer_id, email, subscription_status (active/inactive), and api_key (or session token).

cache: (Optional but recommended) text_hash and ai_score. If 100 users see the same viral AI tweet, you only want to pay to analyze it once.

API Endpoint (/api/analyze):

Input: JSON array of text strings (Batching is crucial).

Auth Middleware: Check if the request comes from a valid, paying user.

Logic:

Check DB Cache (Has this text been scored?).

If not, send to AI Detection Provider (e.g., OpenAI, GPTZero, or a HuggingFace model hosted on your server).

Save result to Cache.

Output: JSON object mapping text IDs to AI percentage (0-100).

Polar.sh Webhooks:

Create a webhook endpoint to listen for subscription.created and subscription.deleted.

Update the users table automatically.

Phase 2: The AI Detection Engine
Decision: You need a provider.

Option A (Cheapest): Use a smaller, open-source model (like RoBERTa-base-openai-detector) hosted on your own server/VPS.

Option B (Easiest): Wrap an existing API (like GPTZero or CopyLeaks), but this eats into your margins.

Recommendation: Start with Option B for MVP speed, move to Option A if scale increases cost.

Phase 3: The Chrome Extension
This is the "Eyes" and "Hands."

Popup UI (Svelte embedded or vanilla HTML):

Login button (redirects to SvelteKit site to auth).

The Slider: A range input (0-100).

Save button (stores preference in chrome.storage.local).

Content Script (content.js):

Observer: Use a MutationObserver to watch the Twitter feed container. Twitter is a Single Page Application (SPA), so elements load dynamically.

Extraction: Target tweet text bodies (usually div[data-testid="tweetText"]).

Batching: Do not send a request for every single tweet instantly. Collect 5-10 tweets or wait 500ms (debounce) before sending a batch to your backend.

The Filter Logic:

Receive scores back from backend.

Compare score vs. user's slider setting.

DOM Action: if (score > userLimit) { element.innerText = ""; }

Refinement: You might want to add a small subtle icon or indicator that says "Clanker Silenced" so the user knows the layout didn't just break.

Phase 4: Payment Integration (Polar.sh)
Create a Product on Polar called "No Clankers Pro" ($19.99).

On your SvelteKit frontend:

User logs in via Magic Link or OAuth.

Check DB. If no sub, show Polar Checkout Button.

If sub active, generate an authToken that the Extension can save.
