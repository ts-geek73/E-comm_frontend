import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCardProps } from '@/types/components';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const ProductCard = ({ data, onClick }: ProductCardProps) => {
  const { image, name, price, categories, brands } = data;
  const [isLoading, setLoading] = useState<boolean>(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [data]);

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
      <CardHeader>
        <div className="relative h-52 aspect-square">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-lg" />
          ) : (
            renderImage()
          )}
        </div>
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

            <Button className="w-full mt-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300">
              Add to Cart
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
