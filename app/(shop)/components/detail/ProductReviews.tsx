'use client'

import { useCallback, useEffect, useState } from 'react';
import { MessageSquare, PenLine, CheckCircle2 } from 'lucide-react';
import { createProductReview, getProductReviews, ProductReview } from '@/app/services/reviews';
import { ApiError } from '@/app/services/fetcher';
import { toast } from '@/app/lib/toast';
import ReviewFormModal from './ReviewFormModal';

interface ProductReviewsProps {
  slug: string;
  productName: string;
}

const INITIAL_VISIBLE = 3;

// Client-side flag so the form stays hidden after reviewing, even before the API answers.
// The backend enforces the real limit (one review per visitor per product).
const storageKey = (slug: string) => `reviewed:${slug}`;

function readReviewedFlag(slug: string): boolean {
  try {
    return localStorage.getItem(storageKey(slug)) === '1';
  } catch {
    return false;
  }
}

function saveReviewedFlag(slug: string) {
  try {
    localStorage.setItem(storageKey(slug), '1');
  } catch {
    // Storage unavailable (private mode) — the backend still blocks duplicates
  }
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('');
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ProductReviews({ slug, productName }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    getProductReviews(slug).then(result => {
      if (!active) return;
      setReviews(result.reviews);
      setHasReviewed(result.hasReviewed || readReviewedFlag(slug));
      setLoading(false);
    });
    return () => { active = false; };
  }, [slug]);

  const markReviewed = () => {
    saveReviewedFlag(slug);
    setHasReviewed(true);
    setFormOpen(false);
  };

  const closeForm = useCallback(() => setFormOpen(false), []);

  const handleSubmit = async (name: string, comment: string): Promise<boolean> => {
    setSubmitting(true);
    try {
      const review = await createProductReview(slug, { name, comment });
      setReviews(prev => [review, ...prev]);
      markReviewed();
      toast('¡Gracias por compartir tu opinión!', 'success');
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 409) markReviewed();
      toast(error instanceof Error ? error.message : 'No se pudo enviar la reseña.', 'error');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const visibleReviews = showAll ? reviews : reviews.slice(0, INITIAL_VISIBLE);

  return (
    <section className="mt-12 border-t border-gray-200 pt-8" aria-labelledby="reviews-title">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 id="reviews-title" className="text-xl font-semibold text-primary">Opiniones de clientes</h3>
          <p className="text-sm text-secondary mt-1">
            {reviews.length === 1 ? '1 reseña' : `${reviews.length} reseñas`}
          </p>
        </div>

        {!loading && !hasReviewed && (
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary border border-primary rounded-full px-5 py-2 hover:bg-primary hover:text-white transition-colors cursor-pointer"
          >
            <PenLine size={15} />
            Escribir una reseña
          </button>
        )}
      </div>

      {hasReviewed && (
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
          <CheckCircle2 size={16} className="shrink-0" />
          Ya compartiste tu opinión sobre este producto. ¡Gracias!
        </div>
      )}

      {formOpen && !hasReviewed && (
        <ReviewFormModal
          productName={productName}
          submitting={submitting}
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      )}

      <div className="mt-6">
        {loading ? (
          <div className="flex flex-col gap-4" aria-hidden="true">
            {[0, 1].map(i => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 w-1/3 rounded bg-gray-200" />
                  <div className="h-3 w-full rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 py-8 text-center">
            <MessageSquare size={28} className="text-gray-300" />
            <p className="text-sm font-medium text-primary">Aún no hay reseñas</p>
            <p className="text-xs text-secondary">Sé el primero en compartir tu opinión.</p>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-gray-200">
              {visibleReviews.map(review => (
                <li key={review.id} className="flex gap-4 py-5 first:pt-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-primary">
                    {initials(review.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="font-semibold text-primary text-sm">{review.name}</span>
                      <time dateTime={review.created_at} className="text-xs text-gray-400">
                        {formatDate(review.created_at)}
                      </time>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-secondary whitespace-pre-wrap break-words">
                      {review.comment}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {reviews.length > INITIAL_VISIBLE && (
              <button
                type="button"
                onClick={() => setShowAll(v => !v)}
                className="mt-2 text-sm font-medium text-primary underline underline-offset-4 hover:opacity-70 cursor-pointer"
              >
                {showAll ? 'Ver menos' : `Ver todas las reseñas (${reviews.length})`}
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
