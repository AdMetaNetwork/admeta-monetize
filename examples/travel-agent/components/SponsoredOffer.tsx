import type { DisplayOffer } from '@/lib/admeta/types';

export function SponsoredOffer({ offer }: { offer: DisplayOffer }) {
  return (
    <aside className="offer-card" aria-label="Sponsored offer">
      <div className="offer-label">
        Sponsored <span aria-hidden="true">·</span>{' '}
        {offer.mode === 'sandbox' ? 'Sandbox' : 'Affiliate'}
      </div>
      <div className="offer-brand-row">
        <div className="offer-mark" aria-hidden="true">D</div>
        <div>
          <p className="offer-brand">{offer.advertiser}</p>
          <p className="offer-title">{offer.title}</p>
        </div>
      </div>
      <div className="offer-footer">
        <strong>{offer.price}</strong>
        <a className="offer-link" href={offer.clickUrl}>
          View offer <span aria-hidden="true">↗</span>
        </a>
      </div>
    </aside>
  );
}
