import { ReviewImageGrid } from "@/components/Review/ReviewImageGrid";
import { Button } from "@/components/ui/button";
import apiServer from "@/lib/axios";
import { ProductFormProps } from "@/types/components";
import { IImageUrlWithFile } from "@/types/product";
import { Camera } from 'lucide-react';
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import RatingStars from "../Header/Ratings";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const ReviewForm: React.FC<ProductFormProps> = ({
  productId,
  selectedReview,
  setSelectedReview,
  setIsEditing,
  updateReviews,
}) => {
  const [updatedReview, setUpdatedReview] = useState({ rate: 0, description: '' });
  const [uploadedImages, setUploadedImages] = useState<IImageUrlWithFile[]>([]);
  const { user } = useClerk();
    const router = useRouter()
  

  useEffect(() => {
    if (selectedReview) {
      setUpdatedReview({ rate: selectedReview.rate, description: selectedReview.description });
      setUploadedImages(selectedReview.images ?? []);
    } else {
      setUpdatedReview({ rate: 0, description: '' });
      setUploadedImages([]);
    }
  }, [selectedReview]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedImages(files.map((f, i) => ({
      url: URL.createObjectURL(f),
      file: f,
      name: f.name || `image-${i}`,
    })));
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!updatedReview.description || !updatedReview.rate) {
      return toast.error("Please complete all fields");
    }

    const formData = new FormData();
    formData.append("rate", String(updatedReview.rate));
    formData.append("description", updatedReview.description);

    uploadedImages.forEach((file) => {
      if (file.file) formData.append("images", file.file);
    });

    try {

      if(!user?.id){
        router.push(`/login`)
      }
      else{
        if (selectedReview) {
          await apiServer.put(`/review/${productId}/user/${user?.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          toast.success("Review updated");
        } else {
          await apiServer.post(`/review/${productId}/user/${user?.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          toast.success("Review submitted");
        }
  
        setIsEditing(false);
        setSelectedReview(null);
        updateReviews();
      }

    } catch {
      toast.error("Failed to submit review");
    }
  };


  return (
    <div
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-medium mb-4">
        {selectedReview ? 'Edit Your Review' : 'Share Your Experience'}
      </h3>

      {/* Rating Selection */}
      <RatingStars
        rating={updatedReview.rate}
        onRate={(r) => setUpdatedReview((prev) => ({ ...prev, rate: r }))}
        showValue={true}
      />


      {/* Review Text */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">Your Review</label>
        <textarea
          value={updatedReview.description}
          onChange={(e) => setUpdatedReview({ ...updatedReview, description: e.target.value })}
          className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder="Share your experience with this product..."
        />
      </div>

      {/* Photos Upload */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">Photos</label>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <label className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors">
              <Camera className="w-5 h-5" />
              <span>Add Photos</span>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {uploadedImages.length > 0 && (
            <ReviewImageGrid
              images={uploadedImages}
              onRemove={handleRemoveImage}
              editable={true}
            />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          {selectedReview ? 'Update Review' : 'Submit Review'}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setIsEditing(false);
            setSelectedReview(null);
          }}
          className="border-gray-300"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ReviewForm
