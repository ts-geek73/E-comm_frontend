'use client';

import { useEffect, useState } from 'react';
import api from '../../../utils/axoins';
import ProductCard from './ProductCard';
import Pagination from './PaginationComp';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCategories } from '@/utils/categoryService';

interface IProduct {
  _id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  features: string[],
  brand: string
  rating: number
}

interface ICategory {
  _id: string;
  name: string;
}

const ProductList = () => {
  const [products, setList] = useState<IProduct[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dataLength, setLength] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch categories.');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const productFetch = async () => {
      setIsLoading(true);
      try {
        const start = (currentPage - 1) * productPerPage;
        const response = await api.get(
          `/product/custome?start=${start}&length=${productPerPage}`
        );

        const data = response.data as { datas: IProduct[]; length: number };
        if (Array.isArray(data.datas)) {
          setList(data.datas);
          setLength(data.length);
        } else {
          setError('Invalid data format from API.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products.');
      } finally {
        setIsLoading(false);
      }
    };

    productFetch();
  }, [currentPage, productPerPage]);

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

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

  const handleProductClick = (product: IProduct) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 container mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Our Products
      </h1>

      <div className="grid justify-center grid-cols-4 gap-6">
        {products?.map((ele) => (
          <ProductCard
            key={ele._id}
            data={ele}
            onClick={() => handleProductClick(ele)}
            categories={categories}
          />
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl bg-white p-8 rounded-2xl shadow-xl transition-all duration-300">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6">
              {selectedProduct && (
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="h-full aspect-square rounded-xl shadow-lg object-cover"
                />
              )}
            </div>

            {/* Product Details Section */}
            <div className="md:w-1/2 overflow-y-auto px-4 max-h-[450px] scrollbar-hide"> 
              <DialogHeader className="mb-6">
                <DialogTitle className="text-4xl font-semibold text-gray-900">
                  {selectedProduct?.name}
                </DialogTitle>
                <DialogDescription className="text-gray-600 text-xl mt-3">
                  {selectedProduct?.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {selectedProduct && (
                  <>
                    {/* Price & Stock Status */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-gray-900 mr-2">
                          {`${selectedProduct.price}`}
                        </p>
                        <p className="text-xl text-gray-600 line-through">
                          {`${(selectedProduct.price * 1.7).toFixed(2)}`} 
                        </p>
                      </div>
                      <span
                        className={`text-lg font-semibold ${selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                      >
                        {selectedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Category */}
                    <p className="text-lg text-gray-700 mt-3">
                      <span className="font-semibold text-gray-800">Category:</span> {getCategoryName(selectedProduct.category_id)}
                    </p>

                    {/* Features Section */}
                    <div className="mt-4">
                      <h3 className="text-xl font-semibold text-gray-800">Features:</h3>
                      <ul className="list-decimal list-inside text-gray-700">
                        {selectedProduct.features &&
                          selectedProduct.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                      </ul>
                    </div>

                    {/* Brand */}
                    <p className="text-lg text-gray-700">
                      <span className="font-semibold text-gray-800">Brand:</span> {selectedProduct.brand}
                    </p>

                    {/* Rating */}
                    <p className="text-lg text-gray-700">
                      <span className="font-semibold text-gray-800">Rating:</span> {selectedProduct.rating}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {dataLength > 0 && (
        <Pagination
          length={dataLength}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default ProductList;
