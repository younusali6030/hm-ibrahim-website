/**
 * Which automated crawlers may fetch the site, in one place (read by app/robots.ts and tests/geo.test.mjs).
 *
 * Owner decision, 12 Oct 2026: block model-training crawlers; keep search, discovery and user-requested retrieval.
 * Tokens below were checked against each operator's own documentation on 12 Oct 2026 (sources in docs/geo/fact-ledger.md).
 *
 * robots.txt is a request that well-behaved crawlers honour. It is not access control and it does not guarantee
 * that content is never used for training.
 */
export const ALLOW_TRAINING_CRAWLERS = false;

/**
 * Training-only controls, each documented by its operator as separate from search:
 *  - GPTBot (OpenAI): training. OAI-SearchBot and ChatGPT-User are separate.
 *  - ClaudeBot (Anthropic): training. Claude-SearchBot and Claude-User are separate.
 *  - Applebot-Extended (Apple): does not crawl; opts content out of foundation-model training. Applebot is separate.
 *  - CCBot (Common Crawl): open web archive used as training data by many third parties.
 *  - meta-externalagent (Meta): training and product indexing. meta-webindexer (Meta AI search) is separate.
 *  - Google-Extended (Google): Gemini training AND Gemini grounding. Not separable from each other; does not affect Search.
 *  - Bytespider (ByteDance): widely reported as a training crawler; ByteDance publishes no robots documentation.
 */
export const TRAINING_CRAWLERS = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "meta-externalagent",
  "Bytespider",
] as const;

/** Search, discovery and user-requested retrieval tokens that stay allowed (no rule is written for them). */
export const SEARCH_CRAWLERS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Applebot",
  "meta-webindexer",
] as const;

/**
 * Crawlers whose training use cannot be switched off without also losing something the shop wants.
 * Left allowed on purpose; see docs/geo/fact-ledger.md.
 *  - Googlebot: Search and AI features in Search share one crawler. Google-Extended does not cover them.
 *  - Bingbot: Microsoft documents no robots.txt training control (page-level meta tags only).
 *  - Amazonbot: one token for product improvement and AI training; Amazon's control is the noarchive meta tag.
 *  - meta-externalfetcher, ChatGPT-User, Perplexity-User: user-triggered fetches that may ignore robots.txt.
 */
export const NOT_SEPARABLE = ["Googlebot", "Bingbot", "Amazonbot", "meta-externalfetcher"] as const;

/** Paths no crawler needs: API routes and the post-submit thank-you pages. */
export const DISALLOWED_PATHS = ["/api/", "/contact/success", "/hi/contact/success"];

export type RobotsRule = { userAgent: string | string[]; allow?: string; disallow?: string | string[] };

/** The rule groups app/robots.ts publishes. */
export function robotsRules(): RobotsRule[] {
  return [
    { userAgent: "*", allow: "/", disallow: DISALLOWED_PATHS },
    ...(ALLOW_TRAINING_CRAWLERS ? [] : [{ userAgent: [...TRAINING_CRAWLERS], disallow: "/" }]),
  ];
}
