export function createSandboxOffer(input) {
    return {
        id: 'demosim-europe-10gb',
        advertiser: 'DemoSIM',
        title: 'Europe 10 GB',
        price: '€18',
        mode: 'sandbox',
        ...input,
    };
}
export function isHttpsUrl(value) {
    try {
        return new URL(value).protocol === 'https:';
    }
    catch {
        return false;
    }
}
export function createCommercialInteractionReceipt(input) {
    const receiptId = input.receiptId ?? globalThis.crypto?.randomUUID?.();
    if (!receiptId)
        throw new Error('A receipt ID is required in this runtime.');
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
