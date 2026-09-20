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
- [ ] Confirm ownership of the `@admeta` npm organization and package names
- [ ] Configure npm Trusted Publishing for both packages
- [ ] Create GitHub release `v0.1.0` using these notes

## One-time npm setup before publishing

1. Sign in to npm with the account that will own the public `@admeta` organization, then create or confirm that organization and grant this account publish access.
2. Confirm that `@admeta/sdk` and `@admeta/cli` are available to that organization. This environment is not authenticated, so no ownership check or publish was attempted.
3. On npmjs.com, open each package's **Settings → Trusted publishing**, choose **GitHub Actions**, and configure: organization `AdMetaNetwork`, repository `admeta-monetize`, workflow filename `publish.yml`, environment `npm-publish`, and allow direct `npm publish`.
4. Review the Linux Foundation Immutable Record notice shown by npm. Do not add an npm write token to GitHub: the prepared workflow uses OIDC (`id-token: write`) and publishes from a GitHub-hosted runner.
5. Create the GitHub release `v0.1.0`. The release-published event runs the workflow and npm automatically creates the provenance attestation for the public packages.
