import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const required = {
  config: 'admeta.config.ts',
  offers: 'lib/admeta/offers.ts',
  receipts: 'lib/admeta/receipts.ts',
  component: ['components/SponsoredOffer.tsx', 'components/sponsored-offer.tsx'],
  clickRoute: 'app/api/admeta/click/route.ts',
};

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readTargetFile(target, relativePath) {
  return readFile(path.join(target, relativePath), 'utf8');
}

export async function verifyTarget(targetDirectory, { log = console.log } = {}) {
  const target = path.resolve(targetDirectory);
  const filesExist = Object.fromEntries(
    await Promise.all(
      Object.entries(required).map(async ([key, file]) => {
        const candidates = Array.isArray(file) ? file : [file];
        return [key, (await Promise.all(candidates.map(candidate => exists(path.join(target, candidate))))).some(Boolean)];
      }),
    ),
  );

  const source = {};
  for (const [key, file] of Object.entries(required)) {
    const candidates = Array.isArray(file) ? file : [file];
    const matched = (
      await Promise.all(candidates.map(async candidate => [candidate, await exists(path.join(target, candidate))]))
    ).find(([, present]) => present)?.[0];
    source[key] = matched ? await readTargetFile(target, matched) : '';
  }

  let packageManifest = {};
  try {
    packageManifest = JSON.parse(await readTargetFile(target, 'package.json'));
  } catch {
    packageManifest = {};
  }
  const dependencies = {
    ...(packageManifest.dependencies ?? {}),
    ...(packageManifest.devDependencies ?? {}),
  };
  const allSource = Object.values(source).join('\n');
  const checks = [
    ['Monetization surface detected', filesExist.component && /SponsoredOffer/.test(source.component)],
    ['Commercial disclosure present', /Sponsored/.test(source.component)],
    ['Organic fallback preserved', /return null|organic|offer \?/.test(`${source.offers}\n${source.component}`)],
    ['Click attribution configured', filesExist.clickRoute && /createClickReceipt/.test(source.clickRoute) && /redirect/.test(source.clickRoute)],
    ['Receipt generation configured', (/receipt_id/.test(source.receipts) && /randomUUID/.test(source.receipts)) || /createCommercialInteractionReceipt/.test(source.receipts)],
    ['Sandbox visibly identified', /Sandbox/.test(source.component) && /sandbox/.test(`${source.config}\n${source.offers}`)],
    ['SDK runtime dependency configured', Boolean(dependencies['@admeta/sdk']) && /@admeta\/sdk/.test(allSource)],
    ['Secrets stay server-side', !/NEXT_PUBLIC_(ADMETA|OFFER|AFFILIATE)/.test(allSource) && /ADMETA_BYO_OFFER_URL/.test(source.offers)],
  ];

  log('admeta verification\n');
  for (const [label, passed] of checks) log(`${passed ? '✓' : '✗'} ${label}`);
  const passed = checks.every(([, result]) => result);
  log(passed ? '\nReady.' : `\nNot ready. Checked ${target}`);
  return { checks, passed, target };
}
