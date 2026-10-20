'use client'

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, PenLine, Loader2 } from 'lucide-react';

interface ReviewFormModalProps {
  productName: string;
  submitting: boolean;
  onSubmit: (name: string, comment: string) => Promise<boolean>;
  onClose: () => void;
}

const MAX_COMMENT = 1000;

const inputClass =
  'w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm';

export default function ReviewFormModal({ productName, submitting, onSubmit, onClose }: ReviewFormModalProps) {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  // Close on Escape and lock page scroll while open
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose, submitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    const ok = await onSubmit(name.trim(), comment.trim());
    if (ok) {
      setName('');
      setComment('');
    }
  };

  const handleBackdrop = () => {
    if (!submitting) onClose();
  };

  // Portal to <body>: the reviews section lives inside animated (transformed)
  // wrappers, which would otherwise trap `position: fixed`.
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-3 sm:p-6">
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={handleBackdrop}
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        className="relative w-full max-w-lg rounded-2xl bg-accent-light shadow-2xl border border-white/60 p-6 sm:p-8"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="absolute right-4 top-4 p-1.5 rounded-full text-secondary hover:text-primary hover:bg-white transition-colors cursor-pointer"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-primary">
            <PenLine size={16} />
          </span>
          <h3 id="review-modal-title" className="text-xl font-semibold text-primary">Escribe tu reseña</h3>
        </div>
        <p className="text-sm text-secondary mb-6 line-clamp-1">{productName}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="review-name" className="block text-sm font-medium text-primary mb-1">Nombre</label>
            <input
              id="review-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="¿Cómo te llamas?"
              maxLength={100}
              required
              autoFocus
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="review-comment" className="block text-sm font-medium text-primary mb-1">Tu opinión</label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Cuéntanos sobre la calidad, la talla y el material"
              maxLength={MAX_COMMENT}
              rows={5}
              required
              className={`${inputClass} resize-none`}
            />
            <p className="mt-1 text-right text-xs text-gray-400">{comment.length}/{MAX_COMMENT}</p>
          </div>

          <p className="text-xs text-secondary">Solo puedes dejar una reseña por producto.</p>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="text-sm font-medium text-secondary border border-gray-300 rounded-full px-6 py-2.5 hover:bg-white transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-primary rounded-full px-6 py-2.5 hover:bg-purple transition-colors disabled:opacity-60 cursor-pointer"
            >
              {submitting && <Loader2 size={15} className="animate-spin" />}
              {submitting ? 'Publicando…' : 'Publicar reseña'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body,
  );
}
