// types/review.ts

import { IImageUrl, IImageUrlWithFile } from "./product";

export interface Review {
  _id: string;
  user_id: string;
  email: string;
  product_id?: string;
  rate: number;
  description: string;
  images?: IImageUrlWithFile[];
}

export interface ProductReviewsResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export interface ReviewFecth{
  reviews: Review[];
  otherReviews: Review[];
  
}

export interface ReviewProductProps {
  productId: string;
}

export interface ConfirmDeleteProps {
  title: string;
  description: string;
  onConfirm: () => Promise<void> | void;
  trigger: React.ReactNode;
}

export interface ReviewFormData {
  rate: number;
  description: string;
  images: File[];
}

export interface ReviewFormProps {
  productId: string;
  initialData?: Review;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface ReviewFormProps {
  productId: string;
  userId: string;
  selectedReview: Review | null;
  setSelectedReview: (review: Review | null) => void;
  setIsEditing: (v: boolean) => void;
  updateReviews: () => void;
}
