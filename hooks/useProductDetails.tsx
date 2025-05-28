import { useEffect, useState } from 'react';
import apiServer from '@/lib/axios'; // Adjust this import to your actual API instance
import { IProductData as IProduct } from '@/types/product';
import { IResponse as ProductResponse } from '@/types/response';
import { AxiosError } from 'axios';

const useProductDetail = (id: string | undefined) => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (product?._id) {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setIsWishlisted(wishlist.includes(product._id));
    }
  }, [product]);

  const toggleWishlist = (product_id: string) => {
    if (!product_id) return;
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    let updatedWishlist;

    if (wishlist.includes(product_id)) {
      updatedWishlist = wishlist.filter((itemId: string) => itemId !== product_id);
    } else {
      updatedWishlist = [...wishlist, product_id];
    }

    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setIsWishlisted(!isWishlisted);
  };


  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await apiServer.get(`/product/${id}`);
        const { product, relatedProducts } = response.data.data as ProductResponse;
        setProduct(product!);
        setRelatedProducts(relatedProducts!);
        setError(null);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          console.log('Error saving review:', error);
          setError(error?.message || 'Something went wrong');
        } else {
          console.log('Unexpected error:', error);

        }


      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, relatedProducts, loading, error, isWishlisted, toggleWishlist};
};

export default useProductDetail