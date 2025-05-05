import { IProductData } from './product';

export interface IResponse {
    message?: string;
    length?: number;
    datas?: IProductData[];
    products: IProductData[];
    totalLength?: number;
    isLoading?: boolean;
    error: string | null;
    product?: IProductData;
    relatedProducts?: IProductData[];

}

export type FileUploadResponse = {
    status: 'success' | 'fail';
    url: string;
    name: string;
};

