export const admetaConfig = {
  mode: process.env.ADMETA_MODE === 'byo' ? 'byo' : 'sandbox',
  publisher: process.env.ADMETA_PUBLISHER ?? 'travel-agent-demo',
} as const;
