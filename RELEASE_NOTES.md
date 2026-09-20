# admeta monetize v0.1.0

## Highlights

- Introduces `@admeta/cli` for Skill installation, `doctor`, minimal `init`, and deterministic `verify` commands.
- Introduces `@admeta/sdk` for shared runtime types, fictional Sandbox offer construction, HTTPS validation, and anonymous click-receipt creation.
- Keeps Codex and the admeta monetize Skill as the semantic repository-understanding and code-modification layer.
- Adds clean tarball/install smoke tests, GitHub CI, and a Trusted Publishing/OIDC-ready npm workflow with provenance.

## Install after the authorized npm release

```bash
npx @admeta/cli@0.1.0 install
```

Restart Codex, open a supported Next.js + Vercel AI SDK app, and say:

```text
monetize this agent
```

Then run:

```bash
npx @admeta/cli@0.1.0 verify .
```

## Product boundaries

- Sandbox offers are clearly fictional.
- BYO uses a destination that the developer controls and for which they have a real commercial relationship.
- admeta Network is not implemented or claimed to be live in v0.1.
- No advertiser supply, revenue, conversion, commission, or affiliate performance is represented by this release.

## Release checklist

- [x] `npm test`
- [x] `npm run test:pack`
- [x] npm package manifests set to `0.1.0` with public access configuration
- [x] OIDC workflow requests npm provenance
- [x] Confirm ownership of the `@admeta` npm organization and package names
- [x] Configure npm Trusted Publishing for both packages
- [x] Create GitHub release `v0.1.0` using these notes

## One-time npm setup before publishing

The first public package versions are now live. npm requires a package to exist before a Trusted Publisher can be attached, so the OIDC-and-provenance `v0.1.1` patch follows this bootstrap release. No npm write token is stored in GitHub.
