import type { UserResource } from '@clerk/types';
import { IProductData , IBrand, ICategory } from './product';

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
  dataIndex?: string;
}

export const defaultFilters: FilterValues = {
  brand: '',
  category: '',
  pricemin: 0,
  pricemax: 50000,
  sort: '',
};

export interface ReviewProductProps {
  productId: string;
}



export interface FilterValues {
  brand: string;
  category: string;
  pricemin: number;
  pricemax: number;
  sort: string;
}

export interface FilterBarProps {
  onFilterChange: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
}
