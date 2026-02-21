"use client"

import { getImageUrl } from '@/app/lib/image';
import { useState } from 'react';

export const GalleryDetail = ({images}: {images: string[]}) => {

      const [thumbsSwiper, setThumbsSwiper] = useState(images[0] || "") ;

      
  return (
    <div className="w-full">
      {/* Thumbnails */}
      <article className='flex justify-between items-justify gap-4'>
        {/* Miniatures Images */}
         <div className='flex flex-col gap-4'>
         {images.map((image, index) => (
           <div key={index} onClick={() => setThumbsSwiper(image)} className='cursor-pointer'>
             {image && <img src={getImageUrl(image)} alt="Imagenita" className='h-12 w-12' />}
           </div>
         ))}
         </div>

         {/* Big Image */}
         <div className='w-full'>  
          {thumbsSwiper && <img src={getImageUrl(thumbsSwiper)} className='h-96 w-96' />}
         </div>
      </article>
</div>
  )
}
