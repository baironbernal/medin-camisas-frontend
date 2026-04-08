"use client"

import Image from 'next/image';
import { getImageUrl } from '@/app/lib/image';
import { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface GalleryDetailProps {
  images: string[];
}

const VISIBLE_THUMBS = 5;

export default function GalleryDetail({ images }: GalleryDetailProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [thumbOffset, setThumbOffset] = useState(0);

  useEffect(() => {
    if (images && images.length > 0) setSelectedIndex(0);
  }, [images]);

  if (!images || images.length === 0) return null;

  const visibleThumbs = images.slice(thumbOffset, thumbOffset + VISIBLE_THUMBS);
  const canScrollUp = thumbOffset > 0;
  const canScrollDown = thumbOffset + VISIBLE_THUMBS < images.length;

  const prev = () => setSelectedIndex(i => (i > 0 ? i - 1 : images.length - 1));
  const next = () => setSelectedIndex(i => (i < images.length - 1 ? i + 1 : 0));

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -40) next();
    else if (info.offset.x > 40) prev();
  };

  return (
    <div className="w-full">

      {/* ── MOBILE: swipeable full-width + dots ── */}
      <div className="lg:hidden">
        <div className="overflow-hidden relative">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            className="cursor-grab active:cursor-grabbing"
          >
            <Image
                src={getImageUrl(images[selectedIndex])}
                alt="Imagen del producto"
                fill
                className="object-contain select-none pointer-events-none"
                draggable={false}
              />
          </motion.div>
        </div>

        {/* Dash dots */}
        {images.length > 1 && (
          <div className="flex gap-1.5 justify-center mt-4">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`h-0.5 rounded-full transition-all duration-300 ${
                  i === selectedIndex ? 'w-8 bg-primary' : 'w-4 bg-gray-300'
                }`}
                aria-label={`Imagen ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── DESKTOP: thumbnails on left + main image + pill arrows ── */}
      <div className="hidden lg:flex gap-4 w-full">

        {/* Thumbnail column */}
        {images.length > 1 && (
          <div className="flex flex-col items-center gap-2 w-20 shrink-0">
            <button
              onClick={() => setThumbOffset(o => Math.max(0, o - 1))}
              disabled={!canScrollUp}
              className="p-1 text-primary disabled:opacity-20 cursor-pointer hover:opacity-60 transition-opacity"
              aria-label="Subir miniaturas"
            >
              <ChevronUp size={20} />
            </button>

            {visibleThumbs.map((image, i) => {
              const realIndex = thumbOffset + i;
              return (
                <div
                  key={realIndex}
                  onClick={() => setSelectedIndex(realIndex)}
                  className={`relative cursor-pointer border-2 transition-all w-16 h-20 overflow-hidden shrink-0 ${
                    selectedIndex === realIndex
                      ? 'border-primary'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={getImageUrl(image)}
                    alt={`Vista ${realIndex + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              );
            })}

            <button
              onClick={() => setThumbOffset(o => Math.min(images.length - VISIBLE_THUMBS, o + 1))}
              disabled={!canScrollDown}
              className="p-1 text-primary disabled:opacity-20 cursor-pointer hover:opacity-60 transition-opacity"
              aria-label="Bajar miniaturas"
            >
              <ChevronDown size={20} />
            </button>
          </div>
        )}

        {/* Main image + side arrows */}
        <div className="relative flex-1 flex items-center justify-center">
          {images.length > 1 && (
            <button
              onClick={prev}
              className="absolute left-0 z-10 flex items-center justify-center px-5 py-2.5 rounded-full border border-primary bg-white/90 hover:bg-white transition-colors shadow-sm cursor-pointer"
              aria-label="Imagen anterior"
            >
              <ArrowLeft size={16} className="text-primary" />
            </button>
          )}

          <div className="relative w-full h-[500px]">
            <Image
              src={getImageUrl(images[selectedIndex])}
              alt="Imagen del producto"
              fill
              className="object-contain"
            />
          </div>

          {images.length > 1 && (
            <button
              onClick={next}
              className="absolute right-0 z-10 flex items-center justify-center px-5 py-2.5 rounded-full border border-primary bg-white/90 hover:bg-white transition-colors shadow-sm cursor-pointer"
              aria-label="Imagen siguiente"
            >
              <ArrowRight size={16} className="text-primary" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
