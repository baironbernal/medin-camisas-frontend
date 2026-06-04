export interface HomeAd {
  id: number;
  message: string;
}

export async function getHomeAds(): Promise<HomeAd[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home-ads`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}
