'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Navigation, Pagination } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';

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
    <Swiper
        pagination={{
          type: 'fraction',
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className={className}
      
      {...defaultOptions}
    >
      {items.map((item) => (
        <SwiperSlide key={getKey(item)}>{renderSlide(item)}</SwiperSlide>
      ))}
    </Swiper>
  );
}

export default SwiperCarousel;
