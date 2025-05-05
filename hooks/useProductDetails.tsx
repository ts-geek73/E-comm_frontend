import { useEffect, useState } from 'react';
import apiServer from '@/lib/axoins'; // Adjust this import to your actual API instance
import { IProductData as IProduct } from '@/types/product'; 
import { IResponse as ProductResponse } from '@/types/responcs'; 

export const useProductDetail = (id: string | undefined) => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await apiServer.get<ProductResponse>(`/product/${id}`);
        const { product, relatedProducts } = response.data;
        setProduct(product!);
        setRelatedProducts(relatedProducts!);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, relatedProducts, loading, error };
};
