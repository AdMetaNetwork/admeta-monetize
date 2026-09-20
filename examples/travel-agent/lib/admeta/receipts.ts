import { appendFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { admetaConfig } from '@/admeta.config';
import type { CommercialInteractionReceipt, ServerOffer } from './types';

const receiptDirectory = path.join(process.cwd(), '.admeta');
const receiptFile = path.join(receiptDirectory, 'receipts.ndjson');

export async function createClickReceipt(offer: ServerOffer) {
  const receipt: CommercialInteractionReceipt = {
    receipt_id: randomUUID(),
    publisher: admetaConfig.publisher,
    offer_id: offer.id,
    intent: offer.intent,
    surface: offer.surface,
    event: 'click',
    timestamp: new Date().toISOString(),
  };

  await mkdir(receiptDirectory, { recursive: true });
  await appendFile(receiptFile, `${JSON.stringify(receipt)}\n`, 'utf8');
  return receipt;
}

export async function countClickReceipts() {
  try {
    const receipts = await readFile(receiptFile, 'utf8');
    return receipts.split('\n').filter(Boolean).length;
  } catch {
    return 0;
  }
}
