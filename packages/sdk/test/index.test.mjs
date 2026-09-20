import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createCommercialInteractionReceipt,
  createSandboxOffer,
  isHttpsUrl,
} from '../dist/index.js';

test('creates the clearly fictional Sandbox fixture', () => {
  const offer = createSandboxOffer({
    destinationUrl: new URL('http://localhost:3000/demo/offer'),
    intent: 'esim-recommendation',
    surface: 'travel-agent-chat',
  });

  assert.deepEqual(offer, {
    id: 'demosim-europe-10gb',
    advertiser: 'DemoSIM',
    title: 'Europe 10 GB',
    price: '€18',
    mode: 'sandbox',
    destinationUrl: new URL('http://localhost:3000/demo/offer'),
    intent: 'esim-recommendation',
    surface: 'travel-agent-chat',
  });
});

test('creates a minimal anonymous click receipt', () => {
  const receipt = createCommercialInteractionReceipt({
    publisher: 'test-publisher',
    offer: { id: 'offer-1', intent: 'travel', surface: 'chat' },
    receiptId: 'receipt-1',
    timestamp: '2026-01-01T00:00:00.000Z',
  });

  assert.deepEqual(receipt, {
    receipt_id: 'receipt-1',
    publisher: 'test-publisher',
    offer_id: 'offer-1',
    intent: 'travel',
    surface: 'chat',
    event: 'click',
    timestamp: '2026-01-01T00:00:00.000Z',
  });
});

test('accepts HTTPS BYO destinations only', () => {
  assert.equal(isHttpsUrl('https://example.com/offer'), true);
  assert.equal(isHttpsUrl('http://example.com/offer'), false);
  assert.equal(isHttpsUrl('not-a-url'), false);
});
