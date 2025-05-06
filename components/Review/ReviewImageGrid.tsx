import { ReviewImageGridProps } from "@/types/components";
import { IImageUrlWithFile } from "@/types/product";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import PaginationComp from "../Product/PaginationComp";

export const ReviewImageGrid : React.FC <ReviewImageGridProps>= ({ 
  images, 
  onRemove, 
  editable = false 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 4;
  
  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const currentImages = images.slice(startIndex, endIndex);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {currentImages.map((img: IImageUrlWithFile, index:number) => (
          <div 
            key={startIndex + index} 
            className="relative group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <div 
              className="aspect-square cursor-pointer overflow-hidden bg-gray-100"
            >
              <Image
                src={img.url}
                alt={img.name || "Review image"}
                width={200}
                height={200}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {editable && onRemove && (
              <button
                onClick={() => onRemove(startIndex + index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {images.length > imagesPerPage && (
        <PaginationComp
          length={images.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
      
    </div>
  );
};


