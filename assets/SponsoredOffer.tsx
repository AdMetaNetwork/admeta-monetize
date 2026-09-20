import type { DisplayOffer } from '@admeta/sdk';

type SponsoredOfferProps = { offer: DisplayOffer };

export function SponsoredOffer({ offer }: SponsoredOfferProps) {
  return (
    <aside aria-label="Sponsored offer">
      <p>Sponsored{offer.mode === 'sandbox' ? ' · Sandbox' : ' · Affiliate'}</p>
      <strong>{offer.advertiser}</strong>
      <span>{offer.title}</span>
      <span>{offer.price}</span>
      <a href={offer.clickUrl}>View offer</a>
    </aside>
  );
}
