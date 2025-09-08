'use client';

import FilterBar from '@components/Product/Filterbar';
import ProductList from '@components/Product/ProductList';
import { FilterValues } from '@types';
import { useState } from 'react';

const AllProductPage = () => {
  const [filters, setFilters] = useState<FilterValues>({
    brand: '',
    category: [],
    pricemin: 0,
    pricemax: 50000,
    sort: 'name',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-8">

        <FilterBar
          onFilterChange={(newFilters) => setFilters(newFilters)}
          initialFilters={filters}
        />

        {/* Main Product Grid */}
        <main className="flex-1 transition-opacity duration-300">
          <ProductList dataIndex={3} filters={filters} />
        </main>
      </div>
    </div>
  );
};

export default AllProductPage;