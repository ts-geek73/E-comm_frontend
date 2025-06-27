import { useEffect, useState } from 'react';
import apiServer from '@/lib/axios'; // your axios instance
import { IProductData as IProduct } from '@/types/product';
import { IResponse as ProductResponse } from '@/types/response';
import { AxiosError } from 'axios';
import { useUser } from '@clerk/nextjs';
import { getWishlist , addToWishlist, getLocalWishlist, removeFromWishlist} from '@/components/Functions/review-whishlist';

const useProductDetail = (id: string | undefined) => {
  const { user } = useUser();
  const user_id = user?.id ?? '';

  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

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
          setError(error?.message || 'Something went wrong');
        } else {
          console.error('Unexpected error:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Update wishlist status when product or user changes
  useEffect(() => {
    if (!product) {
      setIsWishlisted(false);
      return;
    }

    const checkWishlist = async () => {
      if (user_id) {
        // logged-in user: fetch wishlist from server
        try {
          const wishlistProductIds = await getWishlist(user_id);
          setIsWishlisted(wishlistProductIds.includes(product._id));
        } catch (e) {
          console.error("Error fetching wishlist:", e);
          // fallback to local wishlist
          const localWishlist = getLocalWishlist();
          setIsWishlisted(localWishlist.some((item: { _id: string; }) => item._id === product._id));
        }
      } else {
        // guest user: check local storage
        const localWishlist = getLocalWishlist();
        setIsWishlisted(localWishlist.some((item: { _id: string; }) => item._id === product._id));
      }
    };

    checkWishlist();
  }, [product, user_id]);

  // Toggle wishlist item (add or remove)
  const toggleWishlist = async () => {
    if (!product) return;

    if (isWishlisted) {
      // Remove
      if (user_id) {
        await removeFromWishlist(user_id, undefined, product._id);
      }
      // Remove locally too (removeFromWishlist only removes from server, so do local here)
      const localWishlist = getLocalWishlist();
      const updatedLocalWishlist = localWishlist.filter((item: { _id: string; }) => item._id !== product._id);
      localStorage.setItem("wishlist", JSON.stringify(updatedLocalWishlist));
      setIsWishlisted(false);
    } else {
      // Add
      await addToWishlist(user_id, product);
      setIsWishlisted(true);
    }
  };

  return { product, relatedProducts, loading, error, isWishlisted, toggleWishlist };
};

export default useProductDetail;
