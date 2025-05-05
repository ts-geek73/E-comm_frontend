'use client';

import { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
// import { IBrand, ICategory } from '@/types/product';
import { defaultFilters, FilterBarProps, FilterValues } from '@/types/components';
import { BrandCategory, IBrand, ICategory } from '@/types/product';
import { getBrandsandCategories } from '../function';


const FilterBar = ({
  onFilterChange,
  initialFilters,
}: FilterBarProps) => {
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [brandCategoryObject, setBrandCategoryObject] = useState<{
    brands: IBrand[] | null;
    categories: ICategory[] | null;
  }>({
    brands: null,
    categories: null,
  });

  const [filter, setFilter] = useState<FilterValues>(
    initialFilters || defaultFilters );

  useEffect(() => {
    const fetchData = async () => {
      const { brands, categories } = await getBrandsandCategories() as BrandCategory;
      console.log("Brand", brands);
      console.log("categories", categories);
      
      setBrandCategoryObject({
        brands,
        categories,
      });
      setIsLoading(false)
    };
  
    fetchData();
  }, []);

  console.log("brandCategoryObject", brandCategoryObject);
  

  const debouncedFilterChange = useCallback(
    debounce((newFilter: FilterValues) => {
      onFilterChange(newFilter);
      setIsFiltering(false);
    }, 500),
    [onFilterChange]
  );

  const handleFilterChange = (key: keyof FilterValues, value: string | number) => {
    setIsFiltering(true);
    const newFilter = { ...filter, [key]: value };
    
    if (key === 'pricemin' && Number(value) > filter.pricemax) {
      newFilter.pricemax = Number(value);
    }

    if (key === 'pricemax' && Number(value) < filter.pricemin) {
      newFilter.pricemin = Number(value);
    }
    
    setFilter(newFilter);
    debouncedFilterChange(newFilter);
  };

  const clearFilters = () => {
    setIsFiltering(true);
    const defaultFilters = {
      brand: '',
      category: '',
      pricemin: 0,
      pricemax: 50000,
      sort: 'name',
    };
    setFilter(defaultFilters);
    debouncedFilterChange(defaultFilters);
  };

  return (
    <aside className="w-full max-h-min sticky top-16 md:w-72 bg-white rounded-2xl shadow-lg p-6 border border-gray-100 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Filters</h2>
      
      <div className="border-b pb-4">
        <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
          Sort by
        </label>
        <select
          id="sort"
          value={filter.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
        >
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <div className="border-b pb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        {isLoading ? (
          <div className="w-full h-8 bg-gray-200 animate-pulse rounded-lg"></div>
        ) : (
          <select
            id="category"
            value={filter.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
          >
            <option value="">All Categories</option>
            {brandCategoryObject.categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="border-b pb-4">
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
          Brand
        </label>
        {isLoading ? (
          <div className="w-full h-8 bg-gray-200 animate-pulse rounded-lg"></div>
        ) : (
          <select
            id="brand"
            value={filter.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
          >
            <option value="">All Brands</option>
            {brandCategoryObject.brands !== null && brandCategoryObject.brands?.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        
        {/* Price input fields */}
        <div className="flex justify-between items-center mb-3 gap-4">
          <div className="relative w-1/2">
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md pl-6 pr-3 py-2 text-sm"
              value={isFiltering ? '...' : filter.pricemin}
              min={0}
              max={filter.pricemax}
              step={100}
              onChange={(e) => handleFilterChange('pricemin', Number(e.target.value))}
              disabled={isFiltering}
            />
          </div>
          <span className="text-gray-400">to</span>
          <div className="relative w-1/2">
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md pl-6 pr-3 py-2 text-sm"
              value={isFiltering ? '...' : filter.pricemax}
              min={filter.pricemin}
              max={50000}
              step={100}
              onChange={(e) => handleFilterChange('pricemax', Number(e.target.value))}
              disabled={isFiltering}
            />
          </div>
        </div>

       
        <div className="mt-6 mb-4 px-1">
          <div className="relative h-2">

            <div className="absolute w-full h-1 bg-gray-200 rounded-full top-1/2 transform -translate-y-1/2"></div>

            <div 
              className="absolute h-1 bg-blue-500 rounded-full top-1/2 transform -translate-y-1/2"
              style={{
                left: `${(filter.pricemin / 50000) * 100}%`,
                right: `${100 - (filter.pricemax / 50000) * 100}%`
              }}
            ></div>
            
            <div
              className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 hover:scale-110 transition-transform"
              style={{ left: `${(filter.pricemin / 50000) * 100}%` }}
            ></div>
          
            <div
              className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 hover:scale-110 transition-transform"
              style={{ left: `${(filter.pricemax / 50000) * 100}%` }}
            ></div>

            <input
              type="range"
              min="0"
              max="50000"
              step="100"
              value={filter.pricemin}
              onChange={(e) => handleFilterChange('pricemin', Number(e.target.value))}
              className="absolute w-full h-6 opacity-0 cursor-pointer z-20"
              style={{ touchAction: 'none' }}
            />

            <input
              type="range"
              min="0"
              max="50000"
              step="100"
              value={filter.pricemax}
              onChange={(e) => handleFilterChange('pricemax', Number(e.target.value))}
              className="absolute w-full h-6 opacity-0 cursor-pointer z-20"
              style={{ touchAction: 'none', pointerEvents: 'auto' }}
            />
          </div>
        </div>

        <button
          onClick={clearFilters}
          disabled={isFiltering}
          className={`w-full rounded-lg px-4 py-2.5 mt-4 text-sm font-medium text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
            isFiltering 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isFiltering ? 'Clearing...' : 'Clear Filters'}
        </button>
      </div>
    </aside>
  );
};

export default FilterBar;