import { TravelChat } from '@/components/TravelChat';
import { getDisplayOffer } from '@/lib/admeta/offers';
import { countClickReceipts } from '@/lib/admeta/receipts';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [offer, clickCount] = await Promise.all([getDisplayOffer(), countClickReceipts()]);

  return (
    <main>
      <div className="page-intro">
        <a className="admeta-wordmark" href="https://github.com/AdMetaNetwork/admeta-monetize">
          <span>AD</span>META
        </a>
        <div className="mode-pill"><i /> Monetized with AdMeta</div>
      </div>
      <TravelChat offer={offer} clickCount={clickCount} />
      <p className="demo-caption">A useful organic answer, plus one clearly disclosed commercial option.</p>
    </main>
  );
}
