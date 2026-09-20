# AdMeta Monetize

Turn an AI app into a monetized AI app.

> **“monetize this agent”**

![AdMeta Monetize demo](assets/demo.gif)

AdMeta Monetize is an open-source Codex skill that finds a commercial recommendation flow in an existing AI application and adds one transparent monetization slice: an offer, disclosure, click attribution, a commercial interaction receipt, and an organic fallback.

It does not pretend that a network or advertiser supply already exists. Sandbox uses a clearly fictional offer. BYO lets a developer connect a destination they already control, with no AdMeta commission.

## Install

Install directly from this repository with the Codex skill installer, or copy the repository into your Codex skills directory:

```bash
git clone https://github.com/AdMetaNetwork/admeta-monetize.git ~/.codex/skills/admeta-monetize
```

Restart Codex after installation so the skill is discovered.

## Try it

Open an existing Next.js + Vercel AI SDK recommendation app in Codex and say:

```text
monetize this agent
```

Or invoke the skill directly:

```text
Use $admeta-monetize to monetize this agent.
```

Codex reads the repository, identifies one user-facing recommendation flow with commercial intent, chooses a minimal integration point, and patches the app. It uses semantic repository understanding—there is no framework-specific AST scanner.

## How it works

```text
Existing AI app
      │
      ├── useful organic recommendation (preserved)
      │
      └── relevant offer (additive)
              ├── Sponsored / Sandbox disclosure
              ├── same-origin click route
              └── anonymous interaction receipt
```

The initial golden path is deliberately narrow: Next.js, Vercel AI SDK, and a chat or recommendation application.

## What gets added

```text
admeta.config.ts
lib/admeta/
  offers.ts
  receipts.ts
  types.ts
components/
  SponsoredOffer.tsx
app/api/admeta/click/
  route.ts
```

- One clearly disclosed commercial card after the organic answer
- A same-origin attribution route that records before redirecting
- A local receipt with `receipt_id`, `publisher`, `offer_id`, `intent`, `surface`, `event`, and `timestamp`
- A deterministic verifier that checks the monetization contract
- An organic-only fallback when an offer is absent or invalid

## Sandbox vs BYO

| Mode | Offer source | Destination | Economics |
| --- | --- | --- | --- |
| Sandbox | Fictional `DemoSIM` fixture | Local demo confirmation | No revenue or commission claims |
| BYO | Developer-provided URL | Server-only `ADMETA_BYO_OFFER_URL` | AdMeta takes no commission |
| AdMeta Network | Coming soon | Not implemented | Not available |

BYO URLs must use HTTPS. The browser only receives `/api/admeta/click`; the commercial destination remains server-side.

## Example

The included [travel agent](examples/travel-agent) is a small Vercel AI SDK application. It gives a useful Switzerland eSIM answer, then shows a fictional Sandbox offer:

```text
DemoSIM
Europe 10 GB
€18
Sponsored · Sandbox
```

Run it locally:

```bash
cd examples/travel-agent
npm install
cp .env.example .env.local
npm run dev
```

The seeded demo works without a model key. Add `AI_GATEWAY_API_KEY` to send new messages through the Vercel AI SDK route.

Click **View offer** to create `.admeta/receipts.ndjson` and open the local Sandbox confirmation screen. No personal data, prompt text, IP address, or fingerprint is stored.

## Verify

From the repository root:

```bash
npm run verify
```

Or verify a patched application:

```bash
node scripts/verify.mjs /path/to/your/app
```

Expected result:

```text
AdMeta verification

✓ Monetization surface detected
✓ Commercial disclosure present
✓ Organic fallback preserved
✓ Click attribution configured
✓ Receipt generation configured
✓ Sandbox visibly identified
✓ Secrets stay server-side

Ready.
```

## Roadmap

- More tested AI application patterns
- Provider adapters built on real commercial relationships
- Publisher-controlled receipt sinks
- AdMeta Network, when live supply exists

## Principles

Transparent by default. Organic answers remain useful. Commercial content is visibly disclosed. Attribution is minimal and privacy-aware. No fake metrics, customers, supply, or revenue.

MIT licensed. See [LICENSE](LICENSE).
