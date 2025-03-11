import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
  imageUrl: {url:string};
}

interface ICategory {
  _id: string;
  name: string;
}

interface ProductCardProps {
  data: IProduct;
  onClick: (product: IProduct) => void;
  categories: ICategory[];
}

const ProductCard = ({ data, onClick, categories }: ProductCardProps) => {
  const { imageUrl, name, price, stock, category_id } = data;
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); 

    return () => clearTimeout(timer); 
  }, [data]);

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

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
            <Image
            src={imageUrl && imageUrl.url  ? imageUrl.url : "/no-product.png"}
              alt={`${name} Image`}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
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
              <p className="text-sm text-gray-500">{getCategoryName(category_id)}</p>
              <div className="flex items-center justify-between mt-4">
                <h3 className="font-bold text-xl text-gray-900">{`${price} Rs.`}</h3>
                {stock > 0 ? (
                  <span className="text-sm text-green-600">In Stock</span>
                ) : (
                  <span className="text-sm text-red-600">Out of Stock</span>
                )}
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