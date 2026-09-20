# Monetization contract

Use this contract after identifying a commercial recommendation flow in a supported application.

## Invariants

- The organic answer remains useful and visible without an offer.
- A commercial placement is additive and never presented as an organic ranking.
- Every commercial card visibly says `Sponsored`.
- Sandbox cards visibly say `Sandbox` and use fictional offer data.
- A click first reaches a same-origin server route, creates a receipt, then redirects.
- No destination URL, provider credential, or signing secret is exposed through a `NEXT_PUBLIC_` variable.
- Invalid or missing BYO configuration fails closed to the organic experience.
- Receipts contain no user identity, prompt text, IP address, or fingerprint.

## Modes

### Sandbox

Sandbox must work without an offer provider. Use this fictional fixture unless the application calls for another obviously fictional equivalent:

```text
DemoSIM
Europe 10 GB
€18
Sponsored · Sandbox
```

The destination may be a local demo confirmation page or a non-commercial documentation page. Never display commission, revenue, conversion, or earnings claims.

### BYO

BYO uses a server-only `ADMETA_BYO_OFFER_URL`. The developer owns the commercial relationship; AdMeta takes no commission. Validate the URL as `https:` before enabling the offer. Keep it out of client props and client bundles: the browser receives only the local `/api/admeta/click` attribution URL.

### Network

Treat AdMeta Network as `Coming soon`. Do not implement provider supply.

## Receipt

Create this server-side shape on each click:

```ts
type CommercialInteractionReceipt = {
  receipt_id: string;
  publisher: string;
  offer_id: string;
  intent: string;
  surface: string;
  event: 'click';
  timestamp: string;
};
```

For a local demo, append newline-delimited JSON to a file outside version control, or use the application's existing server-side event sink. Generate identifiers with `crypto.randomUUID()` and timestamps with `new Date().toISOString()`.

## Suggested integration API

Keep configuration explicit:

```ts
export const admetaConfig = {
  mode: process.env.ADMETA_MODE === 'byo' ? 'byo' : 'sandbox',
  publisher: process.env.ADMETA_PUBLISHER ?? 'local-demo',
} as const;
```

Resolve the offer on the server. Return a render-safe offer whose `clickUrl` is the same-origin attribution endpoint, never the destination URL.

## Completion checks

Run `scripts/verify.mjs` from this skill with the target directory. Also use the target app's own build/typecheck. Manually confirm that the organic result is visible, the disclosure is legible, and a click returns a redirect while recording a receipt.
