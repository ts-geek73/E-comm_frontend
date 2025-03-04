import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

interface IProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

interface ProductCardProps {
  data: IProduct;
  isLoading: boolean;
}

const ProductCard = ({ data, isLoading }: ProductCardProps) => {
  const { imageUrl, name, price, category, description } = data;

  return (
    <Card className="p-6 space-y-6 rounded-lg border shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <CardHeader>
        <div className="relative h-52 aspect-square">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-lg" />
          ) : (
            <Image
              src={imageUrl}
              alt={`${name} Image`}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
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
            <CardTitle className="text-2xl font-semibold text-gray-800">{name}</CardTitle>
            <p className="text-sm text-gray-500">{category}</p>
            <p className="text-sm text-gray-700 mt-2">{description}</p>
            <div className="flex items-center justify-between mt-4">
              <h3 className="font-bold text-xl text-gray-900">{`${price} Rs.`}</h3>
              {data.stock > 0 ? (
                <span className="text-sm text-green-600">In Stock</span>
              ) : (
                <span className="text-sm text-red-600">Out of Stock</span>
              )}
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
