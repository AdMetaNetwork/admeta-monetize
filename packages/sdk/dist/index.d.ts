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
export declare function createSandboxOffer(input: {
    destinationUrl: URL;
    intent: string;
    surface: string;
}): ServerOffer;
export declare function isHttpsUrl(value: URL | string): boolean;
export declare function createCommercialInteractionReceipt(input: {
    publisher: string;
    offer: Pick<ServerOffer, 'id' | 'intent' | 'surface'>;
    receiptId?: string;
    timestamp?: string;
}): CommercialInteractionReceipt;
