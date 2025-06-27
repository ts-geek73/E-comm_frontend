'use client';

import { defaultFilters, FilterBarProps, FilterValues } from '@/types/components';
import { BrandCategory, IBrand, ICategory } from '@/types/product';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useState } from 'react';
import { getBrandsandCategories } from '../Functions/product';

const FilterBar = ({ onFilterChange, initialFilters }: FilterBarProps) => {
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const maxVisibleCategories = 5;
  const [brandCategoryObject, setBrandCategoryObject] = useState<{
    brands: IBrand[] | null;
    categories: ICategory[] | null;
  }>({
    brands: null,
    categories: null,
  });

  const [filter, setFilter] = useState<FilterValues>(
    initialFilters || defaultFilters
  );

  const toggleCategory = (categoryId: string) => {
    setIsFiltering(true);
    const currentCategories = filter.category || [];
    const updatedCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];

    const newFilter = { ...filter, category: updatedCategories };
    setFilter(newFilter);
    debouncedFilterChange(newFilter);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { brands, categories } = await getBrandsandCategories() as BrandCategory;
        setBrandCategoryObject({ brands, categories });
      } catch (error) {
        console.log("Failed to fetch brands and categories", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const debouncedFilterChange = useMemo(
    () =>
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
    setFilter(defaultFilters);
    debouncedFilterChange(defaultFilters);
  };

  return (
    <aside className="w-full max-h-min sticky top-16 md:w-72 bg-white rounded-2xl shadow-lg p-6 border border-gray-100 space-y-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Filters</h2>

      {/* Sort */}
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

      {/* Category */}
      <div className="border-b pb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        {isLoading ? (
          <div className="w-full h-8 bg-gray-200 animate-pulse rounded-lg"></div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-auto">
            {(showAllCategories
              ? brandCategoryObject.categories
              : brandCategoryObject.categories?.slice(0, maxVisibleCategories)
            )?.map((category, index) => (
              <label key={index} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={filter.category?.includes(category._id as string) || false}
                  onChange={() => toggleCategory(category._id as string)}
                  className="accent-blue-600"
                />
                {category.name}
              </label>
            ))}

            {brandCategoryObject.categories &&
              brandCategoryObject.categories.length > maxVisibleCategories && (
                <button
                  type="button"
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="text-blue-600 text-sm font-medium mt-2"
                >
                  {showAllCategories ? 'Show Less' : 'Show More'}
                </button>
              )}
          </div>
        )}
      </div>


      {/* Brand */}
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
            {brandCategoryObject.brands?.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Price */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
        <div className="flex justify-between items-center gap-4">
          <input
            type="number"
            className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={isFiltering ? '...' : filter.pricemin}
            min={0}
            max={filter.pricemax}
            step={100}
            onChange={(e) => handleFilterChange('pricemin', Number(e.target.value))}
            disabled={isFiltering}
          />
          <span className="text-gray-400">to</span>
          <input
            type="number"
            className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={isFiltering ? '...' : filter.pricemax}
            min={filter.pricemin}
            max={50000}
            step={100}
            onChange={(e) => handleFilterChange('pricemax', Number(e.target.value))}
            disabled={isFiltering}
          />
        </div>

        {/* Slider Track */}
        <div className="relative h-2 mt-6 mb-4 px-1">
          <div className="absolute w-full h-1 bg-gray-200 rounded-full top-1/2 -translate-y-1/2"></div>
          <div
            className="absolute h-1 bg-blue-500 rounded-full top-1/2 -translate-y-1/2"
            style={{
              left: `${(filter.pricemin / 50000) * 100}%`,
              right: `${100 - (filter.pricemax / 50000) * 100}%`,
            }}
          ></div>

          {/* Handles */}
          <div
            className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hover:scale-110 transition-transform"
            style={{ left: `${(filter.pricemin / 50000) * 100}%` }}
          ></div>
          <div
            className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hover:scale-110 transition-transform"
            style={{ left: `${(filter.pricemax / 50000) * 100}%` }}
          ></div>

          {/* Hidden sliders */}
          <input
            type="range"
            min="0"
            max="50000"
            step="100"
            value={filter.pricemin}
            onChange={(e) => handleFilterChange('pricemin', Number(e.target.value))}
            className="absolute w-full h-6 opacity-0 cursor-pointer z-20"
          />
          <input
            type="range"
            min="0"
            max="50000"
            step="100"
            value={filter.pricemax}
            onChange={(e) => handleFilterChange('pricemax', Number(e.target.value))}
            className="absolute w-full h-6 opacity-0 cursor-pointer z-20"
          />
        </div>

        <button
          onClick={clearFilters}
          disabled={isFiltering}
          className={`w-full rounded-lg px-4 py-2.5 mt-4 text-sm font-medium text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${isFiltering ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {isFiltering ? 'Clearing...' : 'Clear Filters'}
        </button>
      </div>
    </aside>
  );
};

export default FilterBar;
