/**
 * Type declarations for the Wompi Checkout Widget
 * Loaded via CDN: https://checkout.wompi.co/mount.js
 * Docs: https://docs.wompi.co/docs/en/widget-checkout-web
 */

interface WompiTransaction {
  id: string;
  status: 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR' | 'PENDING';
  reference: string;
  amount_in_cents: number;
}

interface WompiCloseResult {
  transaction: WompiTransaction | null;
}

interface WompiWidgetConfig {
  currency: string;
  amountInCents: number;
  reference: string;
  publicKey: string;
  signature: { integrity: string };
  redirectUrl?: string;
  expirationTime?: string;
}

declare class WidgetCheckout {
  constructor(config: WompiWidgetConfig);
  open(callback: (result: WompiCloseResult) => void): void;
}
