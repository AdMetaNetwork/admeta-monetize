# admeta monetize v0.1.1

This patch publishes the same v0.1 developer product through npm Trusted Publishing from GitHub Actions.

- Publishes `@admeta/sdk@0.1.1` and `@admeta/cli@0.1.1` through the trusted `AdMetaNetwork/admeta-monetize` `publish.yml` workflow.
- Generates npm provenance attestations for both public packages.
- Keeps the npm-first install flow, Codex Skill integration layer, deterministic CLI verification, and Sandbox/non-affiliation disclosures unchanged.
- Hardens the npm package smoke test so it protects the `admeta` executable declaration without attempting to republish an immutable version.
