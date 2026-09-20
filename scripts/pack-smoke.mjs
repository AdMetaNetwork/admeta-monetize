import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'admeta-pack-smoke-'));
const tarballDirectory = path.join(temporaryRoot, 'tarballs');
const consumerDirectory = path.join(temporaryRoot, 'consumer');

function run(command, argumentsList, options = {}) {
  return execFileSync(command, argumentsList, {
    cwd: repositoryRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  });
}

function pack(workspace) {
  const output = run('npm', ['pack', '--workspace', workspace, '--pack-destination', tarballDirectory]);
  const filename = output.trim().split(/\r?\n/).at(-1);
  assert.match(filename, /\.tgz$/, `npm pack did not return a tarball for ${workspace}`);
  return path.join(tarballDirectory, filename);
}

function tarEntries(tarball) {
  return run('tar', ['-tzf', tarball]).trim().split(/\r?\n/);
}

function publishDryRun(workspace) {
  return run('npm', [
    'publish',
    '--workspace',
    workspace,
    '--access',
    'public',
    '--provenance=false',
    '--dry-run',
  ]);
}

try {
  await mkdir(tarballDirectory, { recursive: true });
  const sdkTarball = pack('@admeta/sdk');
  const cliTarball = pack('@admeta/cli');

  const sdkEntries = tarEntries(sdkTarball);
  const cliEntries = tarEntries(cliTarball);
  assert(sdkEntries.includes('package/dist/index.js'));
  assert(sdkEntries.includes('package/dist/index.d.ts'));
  assert(cliEntries.includes('package/bin/admeta.mjs'));
  assert(cliEntries.includes('package/skill/SKILL.md'));
  assert.doesNotMatch(
    publishDryRun('@admeta/cli'),
    /bin\[admeta\].*invalid and removed/,
    'npm would remove the CLI executable from the published manifest',
  );
  for (const entry of [...sdkEntries, ...cliEntries]) {
    assert(!entry.includes('node_modules/'), `tarball leaked node_modules: ${entry}`);
    assert(!/\.env($|\.)/.test(entry), `tarball leaked environment file: ${entry}`);
  }

  await mkdir(consumerDirectory, { recursive: true });
  await writeFile(path.join(consumerDirectory, 'package.json'), '{"type":"module","private":true}');
  run('npm', ['install', '--ignore-scripts', sdkTarball, cliTarball], { cwd: consumerDirectory });
  run(process.execPath, ['--input-type=module', '--eval', "import { createSandboxOffer } from '@admeta/sdk'; if (createSandboxOffer({ destinationUrl: new URL('http://localhost'), intent: 'test', surface: 'test' }).advertiser !== 'DemoSIM') process.exit(1);"], { cwd: consumerDirectory });
  run(path.join(consumerDirectory, 'node_modules/.bin/admeta'), ['install', '--path', path.join(consumerDirectory, 'skills/admeta-monetize')], { cwd: consumerDirectory });
  run(path.join(consumerDirectory, 'node_modules/.bin/admeta'), ['init', consumerDirectory], { cwd: consumerDirectory });
  await mkdir(path.join(consumerDirectory, 'lib/admeta'), { recursive: true });
  await mkdir(path.join(consumerDirectory, 'components'), { recursive: true });
  await mkdir(path.join(consumerDirectory, 'app/api/admeta/click'), { recursive: true });
  await writeFile(path.join(consumerDirectory, 'lib/admeta/offers.ts'), "import { createSandboxOffer } from '@admeta/sdk';\nexport const offer = createSandboxOffer;\nexport function fallback() { return null; }\nconst byo = process.env.ADMETA_BYO_OFFER_URL;\n");
  await writeFile(path.join(consumerDirectory, 'lib/admeta/receipts.ts'), "import { createCommercialInteractionReceipt } from '@admeta/sdk';\nexport const createClickReceipt = createCommercialInteractionReceipt;\n");
  await writeFile(path.join(consumerDirectory, 'components/SponsoredOffer.tsx'), "export function SponsoredOffer() { return <aside>Sponsored · Sandbox</aside>; }\n");
  await writeFile(path.join(consumerDirectory, 'app/api/admeta/click/route.ts'), "import { createClickReceipt } from '@/lib/admeta/receipts';\nexport async function GET() { await createClickReceipt({}); return Response.redirect('https://example.com'); }\n");
  run(path.join(consumerDirectory, 'node_modules/.bin/admeta'), ['verify', consumerDirectory], { cwd: consumerDirectory });

  console.log('npm pack/install smoke passed for @admeta/sdk and @admeta/cli.');
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
