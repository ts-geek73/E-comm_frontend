"use client";

import api from "@/lib/axoins";
import { Filters, IProductData } from "@/types/product";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useProductFetch = (
  currentPage: number,
  productPerPage: number,
  filters: Filters = {}
): {
  products: IProductData[];
  totalLength: number;
  isLoading: boolean;
  error: string | null;
} => {
  const [products, setProducts] = useState<IProductData[]>([]);
  const [totalLength, setTotalLength] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const start = (currentPage - 1) * productPerPage;
    
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null); // Reset error state before new fetch
      
      try {
        console.log(`Fetching products from: /product/custome with start=${start}&length=${productPerPage}&brand=${filters.brand}&category=${filters.category}&pricemin=${filters.pricemin}&pricemax=${filters.pricemax}&sort=${filters.sort}&search=${filters.search}`);
        
        const response = await api.get(
          `/product?start=${start}&length=${productPerPage}&brand=${filters.brand}&category=${filters.category}&pricemin=${filters.pricemin}&pricemax=${filters.pricemax}&sort=${filters.sort}&search=${filters.search}`
        );
        

        const data = response.data.data;
        
        console.log("Use Fetchn ", data);
        
        
        if (data && Array.isArray(data.data)) {
          setProducts(data.data);
          setTotalLength(data.length || 0);
          // console.log(`Loaded ${data.datas.length} products, total: ${data.length}`);
        } else {
          console.error("Invalid data format:", data);
          setError("Invalid data format from API.");
          setProducts([]);
          setTotalLength(0);
        }
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
      
        console.error("Error fetching products:", error);
        setError(error.message || "Failed to fetch products.");
        setProducts([]);
        setTotalLength(0);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    return () => {
    };
  }, [
    currentPage,
    productPerPage,
    filters.brand,
    filters.category,
    filters.pricemin,
    filters.pricemax,
    filters.sort,
  ]);

  return { products, totalLength, isLoading, error };
};

export default useProductFetch;