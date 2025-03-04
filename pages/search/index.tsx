'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from "@/utils/axoins";
import ProductCard from '@/app/Components/Product/ProductCard';

interface IProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

interface IResponse {
  msg?: string;
  data?: IProduct[];
  related: IProduct[];
}

const Index = () => {
  const query = useSearchParams();
  const search = query?.get('sc') || '';
  
  const [productList, setProductList] = useState<IResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchProducts = async () => {
      setLoading(true);
      setError(null); 

      try {
        const response = await api.get(`product/search?search=${search}`);
        console.log('Search response:', response.data);
        setProductList(response.data as IResponse);
      } catch (error: any) {
        if(error.status == 400){

            setError("Not Found");

        }
        setError('Failed to fetch products. Please try again.');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (search) {
      fetchSearchProducts();
    }
  }, [search]);

  return (
    <div className="p-6 container m-auto space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-900">
        Search Results for "{search}"
      </h1>

      {loading ? (
        <div className="text-center text-lg text-gray-600">Loading products...</div>
      ) : error ? (
        <div className="text-center text-lg text-red-600">{error}</div>
      ) : productList?.data?.length === 0 ? (
        <>
        <div className="text-center text-lg text-gray-600">No products found.</div>
        <h2 className="text-2xl font-semibold text-center text-gray-900 mt-12">
                Other Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productList?.related?.slice(0,6).map((relatedProduct) => (
                  <ProductCard key={relatedProduct.name} data={relatedProduct} isLoading={false} onClick={function (): void {
                        throw new Error('Function not implemented.');
                    } } />
                ))}
              </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productList?.data?.map((product) => (
              <ProductCard key={product.name} data={product} isLoading={false} onClick={function (): void {
                    throw new Error('Function not implemented.');
                } } />
            ))}
          </div>


            
              <h2 className="text-2xl font-semibold text-center text-gray-900 mt-12">
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productList?.related?.slice(0,3).map((relatedProduct) => (
                  <ProductCard key={relatedProduct.name} data={relatedProduct} isLoading={false} onClick={function (): void {
                        throw new Error('Function not implemented.');
                    } } />
                ))}
              </div>
            
          
        </>
      )}
    </div>
  );
};

export default Index;
