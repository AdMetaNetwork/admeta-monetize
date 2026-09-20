import { NextRequest, NextResponse } from 'next/server';
import { isHttpsUrl } from '@admeta/sdk';
import { resolveOffer } from '@/lib/admeta/offers';
import { createClickReceipt } from '@/lib/admeta/receipts';

export async function GET(request: NextRequest) {
  const offer = resolveOffer(request.nextUrl.searchParams.get('offer'));
  if (!offer) return NextResponse.json({ error: 'Offer unavailable' }, { status: 404 });
  if (!isHttpsUrl(offer.destinationUrl) && offer.mode === 'byo') {
    return NextResponse.json({ error: 'Offer unavailable' }, { status: 404 });
  }

  await createClickReceipt(offer);
  return NextResponse.redirect(offer.destinationUrl, 302);
}
