import type { UserResource } from '@clerk/types';
import { IImageUrlWithFile, IProductData } from './product';
import { Review } from './review';

export interface CustomMenuHook {
  isLoaded: boolean;
  user: UserResource | null;
  signOut: () => Promise<void>;
  openUserProfile: () => void;
}

export interface PaginationProps {
  length: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export interface ProductCardProps {
  data: IProductData;
  onClick: (product: IProductData) => void;
}

export interface ProductListProps {
  filters?: FilterValues;
  dataIndex?: number;
}

export const defaultFilters: FilterValues = {
  brand: '',
  category: [],
  pricemin: 0,
  pricemax: 50000,
  sort: '',
};

export interface ReviewProductProps {
  productId: string;
}

export interface ReviewCardProps {
  review: Review;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export interface ProductFormProps {
  productId: string;
  selectedReview: any; // Ideally, define a proper Review type
  setSelectedReview: (review: any) => void;
  setIsEditing: (isEditing: boolean) => void;
  updateReviews: () => void;
}

export interface AdminFormProps {
  productData?: IProductData;
  onSuccess: (msg : string) => void;
  formTitle?: string; 
  formSubtitle?: string; 
  purpose?: 'Create' | 'Update'; 
  isEdit?: boolean;
}


export interface ReviewImageGridProps {
  images: IImageUrlWithFile[];
  onRemove?: (index: number) => void;
  editable?: boolean;
}

export interface ReviewsListProps {
  reviews: Review[];
  onEditReview: (review: Review) => void;
  onDeleteReview: (args: { id: string; user_id: string })  => void;
  showActions ?: boolean
  emptyStateMessage : string
}


export interface FilterValues {
  brand: string;
  category: string[];
  pricemin: number;
  pricemax: number;
  sort: string;
}

export interface FilterBarProps {
  onFilterChange: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
}


export interface RatingStarsProps {
  rating: number;
  onRate?: (rating: number) => void;
  showValue?: boolean;
  size?: number; // optional custom size
}
