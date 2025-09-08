import { ProductCardProps } from "@types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEye, FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const ProductCard = ({
  data,
  onWishlistToggle,
  onAddToCart,
}: ProductCardProps) => {
  const { image, name, price, categories, brands, isWishlisted } = data;
  const [isLoading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [wishlisted, setWishlisted] = useState(isWishlisted);

  useEffect(() => {
    setWishlisted(isWishlisted);
  }, [isWishlisted]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [data]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    if (onWishlistToggle === undefined) return;
    e.stopPropagation();
    setWishlisted(!wishlisted);

    try {
      await onWishlistToggle(data, wishlisted as boolean);
    } catch (error) {
      console.error("Wishlist toggle failed:", error);
      setWishlisted(wishlisted);
    }
  };

  const renderImage = () => {
    const imgSrc = !imageError && image?.url ? image.url : "/no-product.png";
    return (
      <div className="relative overflow-hidden  rounded-2xl group">
        <Image
          src={imgSrc}
          alt={`${name} Image`}
          width={12000}
          height={12000}
          objectFit="cover"
          className="transition-transform h-[200px] duration-700 "
          onError={() => setImageError(true)}
        />
      </div>
    );
  };

  const brandName = brands?.[0]?.name || "Unknown";
  const categoryName = categories?.[0]?.name || "Uncategorized";

  return (
    <Link
      href={`/product/${data._id}`}
      className="group relative min-w-[250px] mx-auto bg-white rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out cursor-pointer overflow-hidden transform"
    >
      <Card className="group relative bg-white rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out cursor-pointer overflow-hidden transform">
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        <div className="absolute inset-0.5 bg-white rounded-3xl -z-10"></div>

        <CardHeader className="relative p-6 pb-4">
          <div className="relative w-full mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100">
            {isLoading ? (
              <Skeleton className="aspect-square w-full rounded-2xl" />
            ) : (
              renderImage()
            )}

            {!isLoading && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                Available
              </div>
            )}
          </div>

          {!isLoading && (
            <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
              <button
                onClick={toggleWishlist}
                className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center  hover:bg-white"
              >
                {wishlisted ? (
                  <FaHeart className="text-red-500 w-5 h-5 animate-pulse" />
                ) : (
                  <FaRegHeart className="text-gray-600 w-5 h-5 group-hover:text-red-500 transition-colors" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
              >
                <FaEye className="text-gray-600 w-5 h-5 hover:text-blue-500 transition-colors" />
              </button>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-6 pt-0">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold min-h-16 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                  {name}
                </h3>

                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs font-medium">
                    {categoryName}
                  </span>
                  <span className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-xs font-medium">
                    {brandName}
                  </span>
                </div>

                {/* Star Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-4 h-4 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">(4.0)</span>
                </div>
              </div>

              {/* Price and CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{price}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ₹{Math.floor(price * 1.2)}
                </span>
              </div>
            </div>
          )}

          {onAddToCart && (
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                onAddToCart(data);
              }}
              className="w-full bg-blue-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-3 transition-all duration-200"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
          )}
        </CardContent>

        {/* Hover Effect Glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </Card>
    </Link>
  );
};

export default ProductCard;
