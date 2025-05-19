export interface IProductData {
  _id: string;
  name: string;
  status?: boolean
  description?: string;
  short_description: string;
  long_description: string;
  price: number;
  image?: IImageUrl
  images?: IImageUrl[];
  brands: IBrand[];
  categories: ICategory[];
}

export interface ICategory {
  _id?: string;
  name: string;
  parentCategory_id?: string;
}

export interface IBrand {
  _id?: string;
  name: string;
  url?: string;
}

export interface BrandCategory {
  brands: IBrand[];
  categories: ICategory[];
}

export interface IImageUrl {
  _id?: string;
  url: string;
  name: string;
}

export interface IImageUrlWithFile extends IImageUrl {
  file: File;
}


export interface Filters {
  brand?: string;
  category?: string[];
  pricemin?: number;
  pricemax?: number;
  sort?: string;
  search?: string;
}

export interface FormValues {
  name: string;
  short_description: string;
  long_description: string;
  brand: string;
  features: string;
  status: boolean;
  category_id: string[];
  imageUrls: IImageUrl[];
  imageFiles: File[];
  price: number;
}

export interface IProductPayload {
  name: string;
  status: boolean;
  short_description: string;
  long_description: string;
  price: number;
  brands: IBrand[];
  categories: ICategory[];
  imageUrls: IImageUrl[];
}

export interface ICartProduct {
  product: IProductData | ICArtProductPayLoad
  qty: number,
  notes?: string
}
export interface ICart {
  products: ICartProduct[]
  totalItems?: number
  totalAmount?: number
}

export interface ICArtProductPayLoad {
  _id: string
  name: string,
  price: number,
  image: { url: string }
  qty: number,
  notes: string
}

export interface ICartresponce {
  cart: ICArtProductPayLoad[]
  totalItems: number
  totalPrice: number
}