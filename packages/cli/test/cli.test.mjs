import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { doctorTarget, initializeProject, installSkill, runCli } from '../src/index.mjs';
import { verifyTarget } from '../src/verify.mjs';

async function temporaryDirectory() {
  return mkdtemp(path.join(os.tmpdir(), 'admeta-cli-test-'));
}

async function makeVerifiedProject(directory) {
  await mkdir(path.join(directory, 'lib/admeta'), { recursive: true });
  await mkdir(path.join(directory, 'components'), { recursive: true });
  await mkdir(path.join(directory, 'app/api/admeta/click'), { recursive: true });
  await writeFile(path.join(directory, 'package.json'), JSON.stringify({
    dependencies: { next: '16.0.0', ai: '6.0.0', '@admeta/sdk': '0.1.0' },
  }));
  await writeFile(path.join(directory, 'admeta.config.ts'), "export const admetaConfig = { mode: 'sandbox' };\n");
  await writeFile(path.join(directory, 'lib/admeta/offers.ts'), "import { createSandboxOffer } from '@admeta/sdk';\nexport const offer = createSandboxOffer;\nexport function fallback() { return null; }\nconst value = process.env.ADMETA_BYO_OFFER_URL;\n");
  await writeFile(path.join(directory, 'lib/admeta/receipts.ts'), "import { createCommercialInteractionReceipt } from '@admeta/sdk';\nexport const createClickReceipt = createCommercialInteractionReceipt;\n// receipt_id\n");
  await writeFile(path.join(directory, 'components/SponsoredOffer.tsx'), "export function SponsoredOffer() { return <aside>Sponsored · Sandbox</aside>; }\n");
  await writeFile(path.join(directory, 'app/api/admeta/click/route.ts'), "import { createClickReceipt } from '@/lib/admeta/receipts';\nexport async function GET() { await createClickReceipt({}); return Response.redirect('https://example.com'); }\n");
}

test('installs the bundled Codex Skill to an explicit directory', async () => {
  const root = await temporaryDirectory();
  try {
    const destination = await installSkill({ destination: path.join(root, 'skills/admeta-monetize') });
    assert.equal(destination, path.join(root, 'skills/admeta-monetize'));
    assert.match(await readFile(path.join(destination, 'SKILL.md'), 'utf8'), /admeta monetize/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('initializes only the minimal configuration file', async () => {
  const root = await temporaryDirectory();
  try {
    await writeFile(path.join(root, 'package.json'), '{}');
    const configPath = await initializeProject(root);
    assert.match(await readFile(configPath, 'utf8'), /ADMETA_MODE/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('doctor and verify identify a supported SDK-backed project', async () => {
  const root = await temporaryDirectory();
  try {
    await makeVerifiedProject(root);
    await mkdir(path.join(root, 'app'), { recursive: true });
    const silent = () => {};
    assert.equal((await doctorTarget(root, { log: silent })).passed, true);
    assert.equal((await verifyTarget(root, { log: silent })).passed, true);
    assert.equal(await runCli(['verify', root], { log: silent }), 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
