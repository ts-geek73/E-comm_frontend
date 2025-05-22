import type { UserResource } from '@clerk/types';
import { IImageUrlWithFile, IProductData } from './product';
import { Review } from './review';
import { FieldErrors, FormState, UseFormRegister, UseFormSetValue } from 'react-hook-form';

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
  selectedReview: Review; // Ideally, define a proper Review type
  setSelectedReview: (review: Review | null) => void;
  setIsEditing: (isEditing: boolean) => void;
  updateReviews: () => void;
}

export interface AdminFormProps {
  productData?: IProductData;
  onSuccess: (msg: string) => void;
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
  onDeleteReview: (args: { id: string; user_id: string }) => void;
  showActions?: boolean
  emptyStateMessage: string
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


export interface FormValues {
  _id?: string
  email?: string
  address_name: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
}

export interface ExtendedFormValues extends FormValues {
  billing: FormValues
  shipping: FormValues
  sameAsBilling: boolean
}

export interface CheckoutFormProps {
  onSubmit: (data: ExtendedFormValues) => void
  savedAddresses?: FormValues[]
  onAddAddress?: (address: FormValues) => void;
  refreshAddresses?: () => Promise<void>

}

export type AddressKey = 'billing' | 'shipping';

export interface AddressFormProps {
  register: UseFormRegister<ExtendedFormValues>
  errors: FormState<ExtendedFormValues>["errors"]
  setValue: UseFormSetValue<ExtendedFormValues>
  savedAddresses: FormValues[]
  selectedAddressId: string | null
  setSelectedAddressId: (id: string | null) => void
  showNewAddressForm: boolean
  setShowNewAddressForm: (show: boolean) => void
  addressType: keyof ExtendedFormValues
   refreshAddresses?: () => Promise<void> 
  fieldPrefix: keyof ExtendedFormValues
  onAddAddress?: (address: FormValues) => void

}

export interface SavedAddress {
  _id?: string;
  address_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export interface SavedAddressListProps {
  savedAddresses: SavedAddress[];
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string) => void;
  addressType: keyof ExtendedFormValues
  onAddNewAddress: () => void;
}

export interface ContactInfoFieldsProps {
  register: UseFormRegister<ExtendedFormValues>;
  errors: FormState<ExtendedFormValues>["errors"]
  fieldPrefix: string;
  userEmail?: string;
}

export interface AddressFieldsProps {
  register: UseFormRegister<ExtendedFormValues>;
  setValue: UseFormSetValue<ExtendedFormValues>;
  errors: FormState<ExtendedFormValues>["errors"]
  fieldPrefix: keyof ExtendedFormValues;
}

export interface NewAddressFormProps {
  register: UseFormRegister<ExtendedFormValues>;
  setValue: UseFormSetValue<ExtendedFormValues>;
  errors: FieldErrors<FormValues>;
  fieldPrefix:  keyof ExtendedFormValues;
  userEmail?: string;
  onCancel: () => void;
}

export interface SavedAddressCardProps {
  address: SavedAddress;
  isSelected: boolean;
  onSelect: (id: string) => void;
}