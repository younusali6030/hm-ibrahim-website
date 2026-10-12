/**
 * Which automated crawlers may fetch the site, in one place (read by app/robots.ts and tests/geo.test.mjs).
 *
 * Search and retrieval crawlers fetch a page so it can be shown or cited in an answer, with a link back.
 * Training crawlers collect pages to train models. The two are separate decisions.
 *
 * Current decision (owner has not asked for an opt-out): everything is allowed, as before.
 * To opt out of model training only, set ALLOW_TRAINING_CRAWLERS to false. Search and retrieval stay allowed.
 * robots.txt is a request, not access control: it does not stop a crawler that ignores it.
 */
export const ALLOW_TRAINING_CRAWLERS = true;

/** User-agents whose job is search or answering a user's request right now. */
export const SEARCH_CRAWLERS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
] as const;

/** User-agents documented by their operators as collecting content for model training. */
export const TRAINING_CRAWLERS = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot", "Bytespider"] as const;

/** Paths no crawler needs: API routes and the post-submit thank-you pages. */
export const DISALLOWED_PATHS = ["/api/", "/contact/success", "/hi/contact/success"];
