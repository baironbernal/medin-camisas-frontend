'use client';

import { Product } from '@/types/product';
import SwiperCarousel from '../../ui/swiper/swiper';
import ProductItem from './productItem';

interface Props {
  products: Product[];
}

const ProductSection = ({ products }: Props) => {
  return (
    <section className="container mx-auto">
      {/*  */}
      <article className='mb-10'>
        <span className="font-bold text-muted">SELECCION DE</span>
        <h2 className="text-dark lg:text-60 text-30">Productos Destacados.</h2>
        <p className="text-muted font-okine text-sm ">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </article>

      {/*  */}
      <SwiperCarousel
        items={products}
        renderSlide={(product) => <ProductItem product={product} />}
        getKey={(product) => product.id}
      />
    </section>
  );
};

export default ProductSection;
