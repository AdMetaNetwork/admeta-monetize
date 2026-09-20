---
name: admeta-monetize
description: Add transparent monetization to an existing Next.js Vercel AI SDK chat or recommendation app. Use when asked to monetize an agent or AI app with disclosed offers, organic fallback, click attribution, and receipts; do not use for building an ad network or inventing live supply.
---

# AdMeta Monetize

Turn a user-facing recommendation flow into a transparently monetized one while preserving its usefulness.

## Supported golden path

Work only in an existing Next.js application that uses the Vercel AI SDK for chat or recommendations. If the application does not match, explain that this first release supports that golden path and stop before making speculative framework changes.

## Understand the app first

Read the repository instructions and inspect the smallest set of files needed to understand:

- the user-facing chat or recommendation surface;
- the server route or action that produces recommendations;
- the existing component and styling conventions;
- where server-only environment configuration belongs;
- the project's build and typecheck commands.

Use semantic understanding of the code. Do not add or run a framework-wide AST scanner.

Choose one clear recommendation flow where the user shows plausible commercial intent. Prefer the smallest integration point that can show one offer without changing the agent's organic answer.

## Add the monetization slice

Read [references/monetization-contract.md](references/monetization-contract.md), then implement its contract. Adapt the templates in `assets/` to the target repository instead of copying blindly.

The usual generated surface is:

```text
admeta.config.ts
lib/admeta/offers.ts
lib/admeta/receipts.ts
lib/admeta/types.ts
components/SponsoredOffer.tsx
app/api/admeta/click/route.ts
```

Keep the integration small and readable:

1. Preserve the complete organic recommendation.
2. Place at most one relevant commercial card after the useful answer.
3. Label the card `Sponsored` in every mode and `Sandbox` when applicable.
4. Send offer clicks through the same-origin attribution route.
5. Generate a server-side click receipt before redirecting.
6. Keep destination URLs and any secrets on the server.
7. In BYO mode, use only a URL supplied by the developer and state that AdMeta takes no commission.
8. If configuration is absent or invalid, render only the organic result.

Do not add claims about advertisers, earnings, conversions, commissions, or revenue. Do not add authentication, payouts, dashboards, tracking pixels, fingerprinting, or user profiling.

## Verify

Run the target project's typecheck or build. Then run this skill's deterministic verifier against the target repository:

```bash
node <skill-directory>/scripts/verify.mjs <target-repository>
```

Fix failed checks that concern the files you added. Report the selected recommendation flow, mode, files changed, and verification result.
