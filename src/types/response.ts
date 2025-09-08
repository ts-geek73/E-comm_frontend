import { IProductData } from './product';

export interface IResponse {
    products: IProductData[];
    error: string | null;
    message?: string;
    length?: number;
    data?: IProductData[];
    totalLength?: number;
    isLoading?: boolean;
    product?: IProductData;
    relatedProducts?: IProductData[];

}

export type FileUploadResponse = {
    status: 'success' | 'fail';
    url: string;
    name: string;
};

