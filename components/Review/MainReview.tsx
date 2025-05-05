'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFileUpload } from '@/hooks/useFileUpload';
import apiServer from '@/lib/axoins';
import { IImageUrl } from '@/types/product';
import { Review } from '@/types/review';
import { useClerk } from '@clerk/nextjs';
import { Loader2, Plus, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ReviewImageGrid, ReviewsList } from './ReviewCard';
import { AxiosError } from 'axios';

const MultiReviewProduct: React.FC<{ 
  productId: string;
  userId?: string;
  showAllReviews?: boolean; 
  maxReviews?: number;
}> = ({ 
  productId, 
  userId: externalUserId, 
  showAllReviews = false,
  maxReviews = 5
}) => {
  const { user } = useClerk();
  const userId = externalUserId || user?.id;
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [updatedReview, setUpdatedReview] = useState<Review>({
    rate: 0,
    description: ''
  });
  const [uploadedImages, setUploadedImages] = useState<IImageUrl[]>([]);

  const { uploadFiles, isUploading, progress } = useFileUpload();

  // Fetch user's own reviews
  const fetchUserReviews = async () => {
    if (!userId) return;
    try {
      const { data } = await apiServer.get(`/review/${productId}/user/${userId}`);
      
      if (data.reviews && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      } else {
        setReviews([]);
      }
    } catch (error) {
      setReviews([]);
      console.error('Error fetching user reviews:', error);
    }
  };

  // Fetch all product reviews
  const fetchAllReviews = async () => {
    if (showAllReviews) {
      try {
        const { data } = await apiServer.get(`/review/${productId}`);
        
        if (data.reviews && Array.isArray(data.reviews)) {
          setAllReviews(data.reviews.slice(0, maxReviews));
        } else {
          setAllReviews([]);
        }
      } catch (error) {
        setAllReviews([]);
        console.error('Error fetching all reviews:', error);
      }
    }
  };
  useEffect(() => {
    fetchUserReviews();
    fetchAllReviews();
  }, [productId, userId]);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    
    // Use the hook to upload files
    const images = await uploadFiles(files);
    
    if (images.length > 0) {
      setUploadedImages(prev => [...prev, ...images]);
      toast.success(`${images.length} image(s) uploaded successfully`);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      if (!userId) return;

      if (uploadedImages.length === 0) {
        toast.error("Please upload at least one image for your review");
        return;
      }

      // Extract just the URLs from the uploadedImages objects for API
      const imageUrls = uploadedImages.map(img => img.url);

      const reviewData = {
        rate: Number(updatedReview.rate),
        description: updatedReview.description,
        images: imageUrls,
      };

      if (selectedReview?._id) {
        await apiServer.put(`/review/${selectedReview._id}`, reviewData);
        toast.success("Review updated successfully");
      } else {
        await apiServer.post(`/review/${productId}/user/${userId}`, reviewData);
        toast.success("Review submitted successfully");
      }
      
      setIsEditing(false);
      setSelectedReview(null);
      setUpdatedReview({ rate: 0, description: '' });
      setUploadedImages([]);
      
      // Refresh reviews
      fetchUserReviews();
      fetchAllReviews();
    } catch (error : unknown) {
      console.error('Error saving review:', error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to save review");
      }
    }
  };

  const handleEditReview = (review: Review) => {
    setSelectedReview(review);
    setUpdatedReview({
      rate: review.rate || 0,
      description: review.description || '',
    });
    
    if (review.images && review.images.length > 0) {
      setUploadedImages(review.images);
    } else {
      setUploadedImages([]);
    }
    
    setIsEditing(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await apiServer.delete(`/review/${reviewId}`);
      toast.success("Review deleted successfully");
      
      // Refresh reviews
      fetchUserReviews();
      fetchAllReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error("Failed to delete review");
    }
  };

  const calculateAverageRating = () => {
    if (!allReviews.length) return 0;
    const total = allReviews.reduce((sum, review) => sum + (review.rate || 0), 0);
    return (total / allReviews.length).toFixed(1);
  };

  return (
    <div className="flex flex-col border rounded-xl shadow-lg p-6 gap-6 bg-white">
      {showAllReviews && (
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Rating summary */}
            <div className="md:w-1/3 flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
              <p className="text-5xl font-bold text-blue-600">{calculateAverageRating()}</p>
              <p className="text-sm text-gray-500 mt-1">out of 5</p>
              <p className="text-sm text-gray-500 mt-3">Based on {allReviews.length} reviews</p>
            </div>
            
            {/* Reviews list */}
            <div className="md:w-2/3">
              {allReviews.length > 0 ? (
                <ReviewsList 
                  reviews={allReviews} 
                  showActions={false}
                />
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No reviews available for this product</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User's own reviews section */}
      <div className="mt-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Your Reviews</h3>
        
        {isEditing ? (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium mb-4">
              {selectedReview ? 'Edit Your Review' : 'Write a Review'}
            </h4>
            
            {/* Review Form */}
            <div className="flex flex-col gap-4">
              {/* Rating Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={updatedReview.rate || ''}
                    onChange={(e) => setUpdatedReview({ ...updatedReview, rate: parseInt(e.target.value) })}
                    placeholder="Rating (1-5)"
                    min={1}
                    max={5}
                    className="w-24"
                  />
                  <span className="text-gray-500">out of 5</span>
                </div>
              </div>

              {/* Review Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                <Textarea
                  value={updatedReview.description}
                  onChange={(e) => setUpdatedReview({ ...updatedReview, description: e.target.value })}
                  placeholder="Write your detailed review here. What did you like or dislike about this product?"
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add Photos
                </label>
                <div className="flex items-center space-x-3">
                  <label className="flex flex-col items-center justify-center w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isUploading ? (
                        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                      ) : (
                        <Upload className="w-6 h-6 text-gray-400" />
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {isUploading ? 'Uploading...' : 'Upload'}
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>

                  {isUploading && (
                    <div className="ml-3">
                      <div className="text-sm text-gray-500">
                        Uploading... {Math.round(progress)}%
                      </div>
                      <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                        <div 
                          className="h-full bg-blue-600 rounded-full" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Uploaded Images Preview */}
                {uploadedImages.length > 0 && (
                  <div className="mt-4">
                    <ReviewImageGrid 
                      images={uploadedImages} 
                      onRemove={removeImage}
                      editable={true}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={!updatedReview.rate || !updatedReview.description || uploadedImages.length === 0 || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  selectedReview ? 'Update Review' : 'Submit Review'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setSelectedReview(null);
                  setUpdatedReview({ rate: 0, description: '' });
                  setUploadedImages([]);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                <ReviewsList 
                  reviews={reviews}
                  onEditReview={handleEditReview}
                  onDeleteReview={handleDeleteReview}
                  showActions={true}
                />
                
                {/* Add another review button */}
                <Button
                  onClick={() => {
                    setSelectedReview(null);
                    setUpdatedReview({ rate: 0, description: '' });
                    setUploadedImages([]);
                    setIsEditing(true);
                  }}
                  className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Plus size={16} className="mr-2" />
                  Add Another Review
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-medium text-gray-700">Share Your Experience</h4>
                <p className="text-gray-500 mt-2">{`You haven't reviewed this product yet`}</p>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white mt-4 hover:bg-blue-700"
                >
                  Write a Review
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MultiReviewProduct;