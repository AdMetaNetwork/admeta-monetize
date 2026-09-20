import { admetaConfig } from '@/admeta.config';
import { createSandboxOffer, isHttpsUrl } from '@admeta/sdk';
import type { DisplayOffer, ServerOffer } from './types';

const sandboxOffer: ServerOffer = createSandboxOffer({
  destinationUrl: new URL('http://localhost:3000/demo/offer'),
  intent: 'esim-recommendation',
  surface: 'travel-agent-chat',
});

function byoOffer(): ServerOffer | null {
  const value = process.env.ADMETA_BYO_OFFER_URL;
  if (!value) return null;

  try {
    const destinationUrl = new URL(value);
    if (!isHttpsUrl(destinationUrl)) return null;
    return { ...sandboxOffer, id: 'publisher-byo-esim', mode: 'byo', destinationUrl };
  } catch {
    return null;
  }
}

export function resolveOffer(id?: string | null): ServerOffer | null {
  const offer = admetaConfig.mode === 'byo' ? byoOffer() : sandboxOffer;
  if (!offer || (id && id !== offer.id)) return null;
  return offer;
}

export function getDisplayOffer(): DisplayOffer | null {
  const offer = resolveOffer();
  if (!offer) return null;
  const { destinationUrl: _destinationUrl, ...display } = offer;
  return { ...display, clickUrl: `/api/admeta/click?offer=${encodeURIComponent(offer.id)}` };
}
