import { ProductCardProps } from '@/types/components';
import { IProductData } from '@/types/product';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

const ProductCard = ({ data, onClick, onWishlistToggle }: ProductCardProps & { onWishlistToggle: (product: IProductData, isWishlisted: boolean) => Promise<void> }) => {
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
    e.stopPropagation();
    setWishlisted(!wishlisted); // optimistic UI update

    try {
      await onWishlistToggle(data, wishlisted as boolean); // pass current state, so parent can add/remove accordingly
    } catch (error) {
      console.error("Wishlist toggle failed:", error);
      setWishlisted(wishlisted); // revert UI state if error
    }
  };

  const renderImage = () => {
    const imgSrc = !imageError && image?.url ? image.url : '/no-product.png';

    return (
      <Image
        src={imgSrc}
        alt={`${name} Image`}
        layout="fill"
        objectFit="cover"
        className="rounded-lg"
        onError={() => setImageError(true)}
      />
    );
  };

  const brandName = brands?.[0]?.name || 'Unknown';
  const categoryName = categories?.[0]?.name || 'Uncategorized';

  return (
    <Card
      className="relative rounded-lg border shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer"
      onClick={() => onClick(data)}
    >
      <CardHeader className="relative">
        <div className="relative h-52 aspect-square">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-lg" />
          ) : (
            renderImage()
          )}
        </div>

        {!isLoading && (
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 z-10 p-1 bg-white rounded-full shadow hover:bg-gray-100 transition"
          >
            {wishlisted ? (
              <FaHeart className="text-red-600 w-5 h-5" />
            ) : (
              <FaRegHeart className="text-gray-500 w-5 h-5" />
            )}
          </button>
        )}
      </CardHeader>

      <CardContent className="flex flex-col min-h-[200px] justify-between">
        {isLoading ? (
          <>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-8 w-full" />
          </>
        ) : (
          <>
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-800">{name}</CardTitle>
              <p className="text-sm text-gray-500 mb-1">{categoryName}</p>
              <p className="text-sm text-gray-500">{brandName}</p>

              <div className="flex items-center justify-between mt-4">
                <h3 className="font-bold text-xl text-gray-900">{`${price} Rs.`}</h3>
                <span className="text-sm text-green-600">Available</span>
              </div>
            </div>

            {/* <Button className="w-full mt-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300">
              Add to Cart
            </Button> */}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
