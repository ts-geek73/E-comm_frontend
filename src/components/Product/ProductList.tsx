"use client";
import { useProductFetch } from "@/hooks";
import { useUser } from "@clerk/nextjs";
import { defaultFilters, ProductListProps } from "@types";
import { useEffect, useState } from "react";
import { handleWishlistToggle } from "../Functions/review-whishlist";
import Pagination from "./PaginationComp";
import ProductCard from "./ProductCard";

const ProductList: React.FC<ProductListProps> = ({
  filters = defaultFilters,
  dataIndex,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productPerPage = 12;
  const { user } = useUser();
  const userId: string = user ? user?.id : " ";

  const { products, totalLength, isLoading, error } = useProductFetch(
    currentPage,
    productPerPage,
    filters
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    filters.brand,
    filters.category,
    filters.pricemin,
    filters.pricemax,
    filters.sort,
  ]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mb-2">Please try again later</p>
          <p className="text-sm text-red-500 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-blue-200">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg
              className="w-8 h-8 text-blue-500 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Loading Products...
          </h3>
          <p className="text-gray-600">
            Please wait while we fetch your products
          </p>
        </div>
      </div>
    );
  }

  if (!products || totalLength === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-yellow-200">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Products Found
          </h3>
          <p className="text-gray-600">Clear the filters to try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Our Products
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover amazing products tailored just for you
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Products Grid */}
        <div className="relative">
          <div
            className={`grid gap-8 ${
              dataIndex === 1
                ? "grid-cols-1"
                : dataIndex === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : dataIndex === 3
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : dataIndex === 4
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {products.map((ele, index) => (
              <div key={ele._id} style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard
                  data={ele}
                  onWishlistToggle={(product, isWishlisted) =>
                    handleWishlistToggle(product, userId, isWishlisted)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center pt-8">
          <Pagination
            length={totalLength}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductList;
