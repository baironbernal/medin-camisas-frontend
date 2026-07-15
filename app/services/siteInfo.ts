export interface SiteInfo {
  company_name: string;
  company_nit: string;
  company_address: string;
  company_city: string;
  company_phone: string;
  company_website: string;
  social_instagram_url: string;
  social_instagram_handle: string;
  social_facebook_url: string;
  social_facebook_handle: string;
  social_tiktok_url: string;
  social_tiktok_handle: string;
}

// Defaults used when the backend is unreachable. Kept in sync with
// backend config/company.php.
export const DEFAULT_SITE_INFO: SiteInfo = {
  company_name: 'MEDIN FASHION FEELS',
  company_nit: '901544814-1',
  company_address: 'CC Punto Once Local 6017',
  company_city: 'Bogotá, D.C. - Colombia',
  company_phone: '3024197103',
  company_website: 'www.camisasmedin.com',
  social_instagram_url: 'https://www.instagram.com/medinfashionfeels',
  social_instagram_handle: '@medinfashionfeels',
  social_facebook_url: 'https://www.facebook.com/medinfashionfeels',
  social_facebook_handle: 'Medin Fashion Feels',
  social_tiktok_url: 'https://www.tiktok.com/@camisasmedin',
  social_tiktok_handle: '@camisasmedin',
};

export async function getSiteInfo(): Promise<SiteInfo> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/metadatos/site-info`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return DEFAULT_SITE_INFO;
    const json = await res.json();
    return { ...DEFAULT_SITE_INFO, ...(json.data ?? {}) };
  } catch {
    return DEFAULT_SITE_INFO;
  }
}
