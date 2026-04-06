## Bonus Blog Post

### The Authorization Problem at the Heart of AI Agents

When I started building MediCheck, the hardest question wasn't "how do I make the AI smart?" — it was "how do I make the AI *trustworthy*?"

Healthcare data is among the most sensitive information a person has. The moment I framed the project as "an AI that acts on your behalf," I ran into a fundamental tension: agents need access to act, but users need control to trust. Giving the AI a single long-lived credential felt wrong — one leaked token and everything is exposed. Scoping permissions per-action was too granular to manage. I needed something in between.

That's where Token Vault clicked for me. The insight is simple but powerful: *each service gets its own isolated token, fetched only at the moment the agent needs it.* No pre-loading, no caching on the client, no god-credential. The agent has to earn access on every tool call.

Getting there wasn't smooth. Auth0 v4, Next.js 16, and Vercel AI SDK v6 all landed with breaking changes simultaneously — routing conventions changed, middleware moved, the session API was restructured. I spent more time reading `node_modules` source than I'd like to admit. The proxy middleware approach for Next.js 16 was particularly underdocumented.

The moment that made it worth it: demoing the revocation flow. Revoke the Insurance token mid-conversation, ask about coverage — the agent immediately responds "I can't check that, you've disconnected insurance." Reconnect it, ask again — works instantly. No restart, no re-login. That live, granular control is what Token Vault uniquely enables, and it's exactly what healthcare AI needs.
