'use client';

import useProductFetch from '@/hooks/useProductFetch';
import { defaultFilters, ProductListProps ,  } from '@/types/components';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Pagination from './PaginationComp';
import ProductCard from './ProductCard';

const ProductList: React.FC<ProductListProps> = ({ filters = defaultFilters , dataIndex = "4" }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productPerPage = 12;
  const router = useRouter();

  const { products, totalLength, isLoading, error } = useProductFetch(
    currentPage,
    productPerPage,
    filters
  );

  useEffect(() => {
    setCurrentPage(1); 
  }, [filters.brand, filters.category, filters.pricemin, filters.pricemax, filters.sort]);

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 font-semibold">
        <p>Oops, something went wrong. Please try again later!</p>
        <p>{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 font-semibold">
        <p>Loading Products...</p>
      </div>
    );
  }

  if (!products || totalLength === 0) {
    return (
      <div className="text-center py-8 font-semibold">
        <p>No products found. Clear the filters to try again.</p>
      </div>
    );
  }

  return (
    <div className="p-6 container mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Our Products
      </h1>

      <div className={`grid grid-cols-${dataIndex} gap-6`}>
        {products.map((ele) => (
          <ProductCard
            key={ele._id}
            data={ele}
            onClick={(product) => router.push(`/product/${product._id}`)}
          />
        ))}
      </div>

      <Pagination
        length={totalLength}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ProductList;
