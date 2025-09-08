"use client";

import { useCart } from "@/context/cart";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CustomMenu from "../CustomMenu/page";

const HeaderComp = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { count: cartItems } = useCart();

  const [searchInput, setSearchInput] = useState<{ search: string; showBox: boolean }>({
    search: "",
    showBox: false,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null; // or a skeleton button
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const { search } = searchInput;
    if (search.trim()) {
      router.push(`/search?sc=${search}`);
      setSearchInput((prev) => ({ ...prev, showBox: false }));
    }
  };

  return (
    <div
      className="w-full z-[100] relative 
    bg-gradient-to-r from-blue-50 via-white to-blue-50 
    dark:from-gray-900 dark:via-gray-950 dark:to-gray-900
    shadow-lg border-b border-blue-100 dark:border-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Image
                  src="/e-co logo.png"
                  alt="logo"
                  height={45}
                  width={45}
                  className="object-contain group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <h1
                className="text-xl lg:text-2xl font-bold 
              bg-gradient-to-r from-blue-600 to-indigo-600 
              bg-clip-text text-transparent"
              >
                Shop_Cart.com
              </h1>
            </Link>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="group relative">
              <span
                className="text-gray-700 dark:text-gray-200 
              hover:text-blue-600 dark:hover:text-blue-400 
              font-medium transition-colors duration-200"
              >
                Products
              </span>
              <span
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full 
              transition-all duration-300"
              ></span>
            </Link>

            <Link href="/cart" className="group relative flex items-center space-x-2">
              <span
                className="text-gray-700 dark:text-gray-200 
              hover:text-blue-600 dark:hover:text-blue-400 
              font-medium transition-colors duration-200"
              >
                Cart
              </span>
              <span
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full 
              transition-all duration-300"
              ></span>
              {cartItems > 0 && (
                <div className="relative">
                  <span
                    className="bg-blue-500 dark:bg-blue-600 text-white text-xs font-bold 
                  px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center"
                  >
                    {cartItems > 9 ? "9+" : cartItems}
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* Search and Menu Section */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button
              onClick={() => setSearchInput((prev) => ({ ...prev, showBox: !prev.showBox }))}
              className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-gray-800 
            transition-colors duration-200 relative group"
              aria-label="Toggle search"
            >
              <Image
                src="/search-removebg-preview.png"
                alt="search"
                height={20}
                width={20}
                className="group-hover:scale-110 transition-transform duration-200 
              dark:invert"
              />
            </button>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              <Link
                href="/products"
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <span className="text-sm font-medium">Products</span>
              </Link>
              <Link
                href="/cart"
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 relative"
              >
                <span className="text-sm font-medium">Cart</span>
                {cartItems > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold 
                  px-1.5 py-0.5 rounded-full min-w-[18px] h-4 flex items-center justify-center"
                  >
                    {cartItems > 9 ? "9+" : cartItems}
                  </span>
                )}
              </Link>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            <CustomMenu />
          </div>
        </div>

        {/* Search Box */}
        {searchInput.showBox && (
          <div className="absolute top-full left-0 right-0 z-50 flex justify-end">
            <div className="max-w-lg py-4 px-4 sm:px-6 lg:px-8 border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSearch} className="relative">
                <div
                  className="flex items-center 
                bg-gray-50 dark:bg-gray-900 
                border-2 border-gray-200 dark:border-gray-700 
                rounded-full shadow-sm 
                focus-within:border-blue-500 dark:focus-within:border-blue-400 
                focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:ring-blue-900 
                transition-all duration-200"
                >
                  <input
                    type="text"
                    name="search"
                    id="search"
                    value={searchInput.search}
                    onChange={(e) =>
                      setSearchInput((prev) => ({ ...prev, search: e.currentTarget.value }))
                    }
                    className="flex-1 px-6 py-3 bg-transparent border-none focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-100 rounded-full"
                    placeholder="Search for products, brands, categories..."
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="mr-2 p-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="Search"
                  >
                    <Image
                      src="/search-removebg-preview.png"
                      alt="search"
                      height={20}
                      width={20}
                      className="filter brightness-0 invert"
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderComp;
