'use client';

import { useEffect, useState } from 'react';
import api from '../../../utils/axoins';
import ProductCard from './ProductCard';
import Pagination from './Pagination';

interface IProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

const ProductList = () => {
  const [products, setList] = useState<IProduct[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage] = useState(9);

  useEffect(() => {
    const productFetch = async () => {

      try {
        const response = await api.get('/product');
        console.log('Response of Product List: ', response.data);

        if (Array.isArray(response.data)) {
          setList(response.data);
        } else {
          setError('Invalid data format from API.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products.');
      } 
       };

    productFetch();
  }, []);

  const lastMovie = currentPage * productPerPage;
  const firstMovie = lastMovie - productPerPage;
  const currentProduct = products?.slice(firstMovie, lastMovie);
  const productLength = products?.length || 0;

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 font-semibold">
        <p>Oops, something went wrong. Please try again later!</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 container m-auto space-y-4">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Our Products
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProduct?.map((ele) => (
          <ProductCard key={ele.name} data={ele} isLoading={false} />
        ))}
      </div>
      
      {productLength > 0 && (
        <Pagination
          length={productLength}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default ProductList;