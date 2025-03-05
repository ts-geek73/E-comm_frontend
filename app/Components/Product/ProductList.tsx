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
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [dataLength, setLength] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage] = useState(9);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    <div className="p-6 container m-auto space-y-4">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Our Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((ele) => (
          <ProductCard
            key={ele.name}
            data={ele}
            isLoading={false}
            onClick={() => handleProductClick(ele)}
          />
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-white p-6 rounded-lg shadow-xl transition-all duration-300">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-3xl font-semibold text-gray-800">
              {selectedProduct?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-lg mt-2">
              {selectedProduct?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedProduct && (
              <>
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold text-gray-900">{`${selectedProduct.price} Rs.`}</p>
                  <span
                    className={`text-sm font-semibold ${
                      selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {selectedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <p className="text-lg text-gray-700 mt-2">Category: {selectedProduct.category}</p>

                <div className="mt-4">
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-6">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Close
            </button>
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
