'use server';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  console.log(`[apiFetch] Fetching: ${url}`);
  
  try {
    const res = await fetch(url, {
      ...options,
      next: options.next, // allow revalidate
    });

    if (!res.ok) {
        console.error(`[apiFetch] Error ${res.status}: ${res.statusText}`);
        throw new Error("API Error");
    }
    return res.json();
  } catch (error) {
    console.error(`[apiFetch] Network error fetching ${url}:`, error);
    throw error;
  }
}