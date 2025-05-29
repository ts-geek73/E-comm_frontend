"use client";

import api from "@/lib/axios";
import { Filters, IProductData } from "@/types/product";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs"; // Assuming Clerk is used
import { getWishlist } from "@/components/function";

const useProductFetch = (
  currentPage: number,
  productPerPage: number,
  filters: Filters = {}
): {
  products: IProductData[];
  totalLength: number;
  isLoading: boolean;
  error: string | null;
  refresh : ()=>Promise<void>
} => {
  const [products, setProducts] = useState<IProductData[]>([]);
  const [totalLength, setTotalLength] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useUser();
  const start = (currentPage - 1) * productPerPage;

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(
        `/product?start=${start}&length=${productPerPage}&brand=${filters.brand}&category=${filters.category}&pricemin=${filters.pricemin}&pricemax=${filters.pricemax}&sort=${filters.sort}&search=${filters.search}`
      );

      const data = response.data.data;

      if (
        data &&
        typeof data.length === "number" &&
        Array.isArray(data.data)
      ) {
        let wishlist: string[] = [];

        if (user) {
          try {
            wishlist = await getWishlist(user?.id) || [];
          } catch (err) {
            console.error("Failed to fetch wishlist for user:", err);
          }
        } else {
          const localWishlist = localStorage.getItem("wishlist");
          wishlist = localWishlist ? JSON.parse(localWishlist) : [];
        }

        const updatedProducts = data.data.map((product: IProductData) => ({
          ...product,
          isWishlisted: wishlist.includes(product._id),
        }));

        setProducts(updatedProducts);
        setTotalLength(data.length || 0);
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
      }
      setProducts([]);
      setTotalLength(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [
    currentPage,
    productPerPage,
    filters.brand,
    filters.category,
    filters.pricemin,
    filters.pricemax,
    filters.sort,
    filters.search,
    user,
  ]);

  return { products, totalLength, isLoading, error, refresh:fetchProducts };
};

export default useProductFetch;
