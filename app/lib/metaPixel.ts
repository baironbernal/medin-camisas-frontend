/**
 * Meta (Facebook) Pixel helpers.
 *
 * NEXT_PUBLIC_META_PIXEL_ID overrides the default Pixel; the ID is public
 * (it ships in the page HTML), so it's safe to keep as a fallback here.
 */

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '966084697955782';

export const CURRENCY = 'COP';

type MetaEvent =
  | 'PageView'
  | 'ViewContent'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'Purchase'
  | 'Contact'
  | 'CompleteRegistration'
  | 'Search';

type Fbq = (command: 'track', event: MetaEvent, params?: Record<string, unknown>, options?: { eventID?: string }) => void;

/**
 * Send a standard event to Meta.
 * `eventId` lets Meta deduplicate the same event sent from the server
 * (Conversions API) — e.g. Purchase uses the order number on both sides.
 */
export function trackMetaEvent(event: MetaEvent, params?: Record<string, unknown>, eventId?: string) {
  if (!META_PIXEL_ID || typeof window === 'undefined') return;
  const fbq = (window as Window & { fbq?: Fbq }).fbq;
  if (!fbq) return;
  fbq('track', event, params, eventId ? { eventID: eventId } : undefined);
}

/** Meta browser cookies, forwarded to the backend so server events can be matched. */
export function getMetaCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === 'undefined') return {};
  const read = (name: string) =>
    document.cookie.split('; ').find(c => c.startsWith(`${name}=`))?.split('=')[1];
  return { fbp: read('_fbp'), fbc: read('_fbc') };
}
