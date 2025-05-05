// types/review.ts

import { IImageUrl } from "./product";

  export interface Review {
    _id?: string;
    user_id?: string;
    product_id?: string;
    rate: number;
    description: string;
    images?: IImageUrl[];
  }
  
  export interface ProductReviewsResponse {
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
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