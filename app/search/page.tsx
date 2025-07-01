'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { IProductData } from '@/types/product';
import apiServer from '@/lib/axios';
import ProductCard from '@/components/Product/ProductCard';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { handleWishlistToggle } from '@/components/Functions/review-whishlist';

interface IResponse {
  msg?: string;
  data?: IProductData[];
  related: IProductData[];
}

const CheckoutSuccessContent = () => {
  const query = useSearchParams();
  const search = query?.get('sc') || '';

  const [productList, setProductList] = useState<IResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const userId: string = user ? user?.id : " ";

  useEffect(() => {
    const fetchSearchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiServer.get(`product?search=${search}`);
        const responseData = response.data.data as IResponse;
        console.log('Search response:', responseData);

        if (responseData.data && responseData.data.length === 0) {
          setProductList({
            msg: 'No products found.',
            related: responseData.related,
          });
        } else {
          setProductList(responseData);
        }
      } catch (error) {
        if ((error as AxiosError).isAxiosError) {
          const axiosError = error as AxiosError;

          if (axiosError.response?.status === 404) {
            setError('No products found for this search.');
          } else {
            setError('Failed to fetch products. Please try again.');
          }
        } else {
          setError('An unexpected error occurred.');
        }
      }
      finally {
        setLoading(false);
      }
    };

    if (search) {
      fetchSearchProducts();
    }
  }, [search]);

  const handleProductClick = (product: IProductData) => {
    console.log('Product clicked:', product);
  };

  return (
    <div className="p-6 container m-auto space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-900">
        {`Search Results for "${search}"`}
      </h1>

      {loading ? (
        <div className="text-center text-lg text-gray-600">Loading products...</div>
      ) : error ? (
        <div className="text-center text-lg text-red-600">{error}</div>
      ) : productList?.data?.length === 0 ? (
        <>
          <div className="text-center text-lg text-gray-600">{productList?.msg}</div>
          <h2 className="text-2xl font-semibold text-center text-gray-900 mt-12">Other Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productList?.related?.slice(0, 6).map((relatedProduct) => (
              <ProductCard
                key={relatedProduct._id}
                data={relatedProduct}
                onWishlistToggle={(product, isWishlisted) =>
                  handleWishlistToggle(product, userId, isWishlisted)
                }
                onClick={handleProductClick} />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productList?.data?.map((product) => (
              <ProductCard key={product._id} data={product}
                onWishlistToggle={(product, isWishlisted) =>
                  handleWishlistToggle(product, userId, isWishlisted)
                }
                onClick={handleProductClick} />
            ))}
          </div>
          <h2 className="text-2xl font-semibold text-center text-gray-900 mt-12">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productList?.related?.slice(0, 9).map((relatedProduct) => (
              <ProductCard key={relatedProduct._id}
                onWishlistToggle={(product, isWishlisted) =>
                  handleWishlistToggle(product, userId, isWishlisted)
                }
                data={relatedProduct} onClick={handleProductClick} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
