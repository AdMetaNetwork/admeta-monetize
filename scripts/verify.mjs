#!/usr/bin/env node

import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const skillRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const target = path.resolve(process.argv[2] ?? path.join(skillRoot, 'examples/travel-agent'));

const required = {
  config: 'admeta.config.ts',
  offers: 'lib/admeta/offers.ts',
  receipts: 'lib/admeta/receipts.ts',
  component: 'components/SponsoredOffer.tsx',
  clickRoute: 'app/api/admeta/click/route.ts',
};

async function text(relativePath) {
  return readFile(path.join(target, relativePath), 'utf8');
}

async function exists(relativePath) {
  try {
    await access(path.join(target, relativePath));
    return true;
  } catch {
    return false;
  }
}

const filesExist = Object.fromEntries(
  await Promise.all(Object.entries(required).map(async ([key, file]) => [key, await exists(file)])),
);

const source = {};
for (const [key, file] of Object.entries(required)) {
  source[key] = filesExist[key] ? await text(file) : '';
}

const checks = [
  ['Monetization surface detected', filesExist.component && /SponsoredOffer/.test(source.component)],
  ['Commercial disclosure present', /Sponsored/.test(source.component)],
  ['Organic fallback preserved', /return null|organic|offer \?/.test(`${source.offers}\n${source.component}`)],
  ['Click attribution configured', filesExist.clickRoute && /createClickReceipt/.test(source.clickRoute) && /redirect/.test(source.clickRoute)],
  ['Receipt generation configured', /receipt_id/.test(source.receipts) && /randomUUID/.test(source.receipts) && /timestamp/.test(source.receipts)],
  ['Sandbox visibly identified', /Sandbox/.test(source.component) && /sandbox/.test(`${source.config}\n${source.offers}`)],
  ['Secrets stay server-side', !/NEXT_PUBLIC_(ADMETA|OFFER|AFFILIATE)/.test(Object.values(source).join('\n')) && /ADMETA_BYO_OFFER_URL/.test(source.offers)],
];

console.log('AdMeta verification\n');
for (const [label, passed] of checks) console.log(`${passed ? '✓' : '✗'} ${label}`);

if (checks.every(([, passed]) => passed)) {
  console.log('\nReady.');
} else {
  console.error(`\nNot ready. Checked ${target}`);
  process.exitCode = 1;
}
