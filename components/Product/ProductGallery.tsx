'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { IImageUrl } from '@/types/product'; 

export const ProductImageGallery: React.FC<{ images: IImageUrl[];}> = ({  images, }) => {
  
  const [selectedImage, setSelectedImage] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="p-6 md:p-8 bg-gray-50">
      <div className="relative md:h-96 flex items-center justify-center mb-4">
        <Image
          src={images[selectedImage].url}
          alt={images[selectedImage].name}
          fill
          className="max-h-full max-w-full object-contain"
        />

        {images.length > 1 && (
          <>
            {selectedImage > 0 && (
              <button
                onClick={() => setSelectedImage((prev) => prev - 1)}
                className="absolute left-2 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {selectedImage < images.length - 1 && (
              <button
                onClick={() => setSelectedImage((prev) => prev + 1)}
                className="absolute right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow-md"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex space-x-2 justify-center">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative w-16 h-16 border-2 rounded overflow-hidden ${
                selectedImage === idx ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <Image
                fill
                src={img.url}
                alt={`Thumbnail ${idx + 1}`}
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
