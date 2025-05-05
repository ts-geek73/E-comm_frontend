'use client';

import { Button } from '@/components/ui/button';
import { IImageUrl } from '@/types/product';
import { Review } from '@/types/review';
import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import PaginationComp from '@/components/Product/PaginationComp';
import RatingStars from '../Header/Ratings';
import ConfirmDelete from '@/components/Header/ConfirmDelete';

// Single Review Display Component
const ReviewCard: React.FC<{
  review: Review;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}> = ({ review, onEdit, onDelete, showActions = true }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 4;
  
  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const currentImages = review.images?.slice(startIndex, endIndex) || [];

  return (
    <div className="flex flex-col border rounded-lg shadow p-4 gap-4 bg-white transition-all hover:shadow-md">
      {/* Rating and timestamp header */}
      <div className="flex justify-between items-center border-b pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">{review.rate}</span>
          <RatingStars rating={review.rate} />
        </div>
       
      </div>

      {/* Review text */}
      <div className="bg-gray-50 p-3 rounded">
        <p className="text-gray-700">{review.description}</p>
      </div>

      {/* Review Images with Pagination */}
      {review.images && review.images.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {currentImages.map((img, index) => (
              <div key={startIndex + index} className="relative group">
                <div className="overflow-hidden rounded aspect-square">
                  <Image
                    src={img.url}
                    alt="Review"
                    width={150}
                    height={150}
                    className="rounded object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </div>

          {review.images.length > imagesPerPage && (
            <PaginationComp
              length={review.images.length}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      )}

      {/* Action buttons */}
      {showActions && onEdit && onDelete && (
        <div className="flex gap-3 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex items-center gap-1 hover:bg-blue-50"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
          <ConfirmDelete
            title="Delete Review"
            description="Are you sure you want to delete this review? This action cannot be undone."
            onConfirm={onDelete}
            trigger={
              <Button variant="outline" size="sm" className="flex items-center gap-1 hover:bg-red-50">
                <Trash2 className="w-4 h-4 text-red-500" />
                Delete
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
};

export default ReviewCard

export const ReviewsList: React.FC<{
  reviews: Review[];
  onEditReview?: (review: Review) => void;
  onDeleteReview?: (reviewId: string) => void;
  showActions?: boolean;
  emptyStateMessage?: string;
}> = ({ 
  reviews, 
  onEditReview, 
  onDeleteReview, 
  showActions = true,
  emptyStateMessage = "No reviews available" 
}) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">{emptyStateMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewCard
          key={review._id || `review-${Math.random()}`}
          review={review}
          onEdit={() => onEditReview && onEditReview(review)}
          onDelete={() => onDeleteReview && review._id && onDeleteReview(review._id)}
          showActions={showActions}
        />
      ))}
    </div>
  );
};

export const ReviewImageGrid: React.FC<{
  images: IImageUrl[];
  onRemove?: (index: number) => void;
  editable?: boolean;
}> = ({ images, onRemove, editable = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 4;
  
  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const currentImages = images.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {currentImages.map((img, index) => (
          <div key={startIndex + index} className="relative group">
            <div className="overflow-hidden rounded-lg aspect-square">
              <Image
                src={img.url}
                alt={img.name || "Review image"}
                width={200}
                height={200}
                className="rounded-lg object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              {editable && onRemove && (
                <button
                  onClick={() => onRemove(startIndex + index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
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