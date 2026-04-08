'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import './styles.css';

export interface SwiperCarouselProps<T> {
  items: T[];
  renderSlide: (item: T) => React.ReactNode;
  getKey: (item: T) => string | number;
  swiperOptions?: SwiperOptions;
  className?: string;
}

function SwiperCarousel<T>({
  items,
  renderSlide,
  getKey,
  swiperOptions,
  className = 'mySwiper',
}: SwiperCarouselProps<T>) {
  const swiperRef = useRef<SwiperType | null>(null);

  const defaultOptions: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 10,
    breakpoints: {
      640: { slidesPerView: 2, spaceBetween: 20 },
      768: { slidesPerView: 4, spaceBetween: 40 },
      1024: { slidesPerView: 4, spaceBetween: 50 },
    },
    ...swiperOptions,
  };

  return (
    <div className="relative">
      <Swiper
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        pagination={{ type: 'fraction' }}
        modules={[Pagination]}
        className={className}
        {...defaultOptions}
      >
        {items.map((item) => (
          <SwiperSlide key={getKey(item)}>{renderSlide(item)}</SwiperSlide>
        ))}
      </Swiper>

      {/* Prev arrow — matches product detail style */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center px-5 py-2.5 rounded-full border border-primary bg-white/90 hover:bg-white transition-colors shadow-sm cursor-pointer"
        aria-label="Anterior"
      >
        <ArrowLeft size={16} className="text-primary" />
      </button>

      {/* Next arrow — matches product detail style */}
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center px-5 py-2.5 rounded-full border border-primary bg-white/90 hover:bg-white transition-colors shadow-sm cursor-pointer"
        aria-label="Siguiente"
      >
        <ArrowRight size={16} className="text-primary" />
      </button>
    </div>
  );
}

export default SwiperCarousel;
