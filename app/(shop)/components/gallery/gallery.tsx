"use client"

import { getImageUrl } from '@/app/lib/image';
import { useEffect, useState } from 'react';

interface GalleryDetailProps {
  images: string[];
}

export const GalleryDetail = ({images}: GalleryDetailProps) => {

    const [thumbsSwiper, setThumbsSwiper] = useState(images?.[0] || "");

    useEffect(() => {
      if (images && images.length > 0) {
        setThumbsSwiper(images[0])
      }
    }, [images])
      
  return (
    <div className="w-full">
      {/* Big Image */}
      <div className="w-full mb-4">
        {thumbsSwiper && <img src={getImageUrl(thumbsSwiper)} alt="Product Image" className='w-full h-auto max-h-[500px] object-contain' />}
      </div>
      
      {/* Thumbnails */}
      {images && images.length > 1 && (
        <div className='flex gap-2 overflow-x-auto pb-2'>
          {images?.map((image, index) => (
            <div 
              key={index} 
              onClick={() => setThumbsSwiper(image)} 
              className={`cursor-pointer border-2 transition-all ${
                thumbsSwiper === image ? 'border-primary' : 'border-transparent hover:border-gray-300'
              }`}
            >
              {image && <img src={getImageUrl(image)} alt={`Thumbnail ${index + 1}`} className='h-16 w-16 object-cover' />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
