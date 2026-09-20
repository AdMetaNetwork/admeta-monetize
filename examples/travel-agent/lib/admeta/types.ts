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
