/** Shared server-safe primitives for application-specific admeta integrations. */
export type OfferMode = 'sandbox' | 'byo';

export type ServerOffer = {
  id: string;
  advertiser: string;
  title: string;
  price: string;
  mode: OfferMode;
  destinationUrl: URL;
  intent: string;
  surface: string;
};

export type DisplayOffer = Omit<ServerOffer, 'destinationUrl'> & {
  clickUrl: string;
};

export type CommercialInteractionReceipt = {
  receipt_id: string;
  publisher: string;
  offer_id: string;
  intent: string;
  surface: string;
  event: 'click';
  timestamp: string;
};

export function createSandboxOffer(input: {
  destinationUrl: URL;
  intent: string;
  surface: string;
}): ServerOffer {
  return {
    id: 'demosim-europe-10gb',
    advertiser: 'DemoSIM',
    title: 'Europe 10 GB',
    price: '€18',
    mode: 'sandbox',
    ...input,
  };
}

export function isHttpsUrl(value: URL | string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

export function createCommercialInteractionReceipt(input: {
  publisher: string;
  offer: Pick<ServerOffer, 'id' | 'intent' | 'surface'>;
  receiptId?: string;
  timestamp?: string;
}): CommercialInteractionReceipt {
  const receiptId = input.receiptId ?? globalThis.crypto?.randomUUID?.();
  if (!receiptId) throw new Error('A receipt ID is required in this runtime.');

  return {
    receipt_id: receiptId,
    publisher: input.publisher,
    offer_id: input.offer.id,
    intent: input.offer.intent,
    surface: input.offer.surface,
    event: 'click',
    timestamp: input.timestamp ?? new Date().toISOString(),
  };
}
