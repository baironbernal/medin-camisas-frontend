export class NotFoundError extends Error {}
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    next: options.next,
  });

  if (res.status === 404) {
    throw new NotFoundError("Resource not found");
  }

  if (!res.ok) {
    throw new Error(`API Error ${res.status}`);
  }

  return res.json();
}