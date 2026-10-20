import { apiFetch } from './fetcher';

export interface ProductReview {
  id: number;
  name: string;
  comment: string;
  created_at: string;
}

interface ReviewsResponse {
  success: boolean;
  data: ProductReview[];
  has_reviewed: boolean;
}

export interface ProductReviewsResult {
  reviews: ProductReview[];
  hasReviewed: boolean;
}

interface ReviewResponse {
  success: boolean;
  data: ProductReview;
}

export async function getProductReviews(slug: string): Promise<ProductReviewsResult> {
  try {
    const res = await apiFetch<ReviewsResponse>(`/products/${slug}/reviews`, { cache: 'no-store' });
    return { reviews: res.data ?? [], hasReviewed: Boolean(res.has_reviewed) };
  } catch {
    return { reviews: [], hasReviewed: false };
  }
}

export async function createProductReview(
  slug: string,
  payload: { name: string; comment: string },
): Promise<ProductReview> {
  const res = await apiFetch<ReviewResponse>(`/products/${slug}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.data;
}
