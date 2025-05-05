"use client";

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import useProductFetch from "@/hooks/useProductFetch";
import { IProductData } from "@/types/product";
import Image from "next/image";

export default function EcommerceCarousel({ products }: { products?: IProductData[] }) {
    const shouldFetch = !products;
    const { products: fetchedProducts, error, isLoading } = useProductFetch(1, 5);
  
    const displayProducts = products ?? fetchedProducts;

    if (error) return <div className="text-center text-red-500 py-6">Error loading products.</div>;
    if (shouldFetch && isLoading) return <div className="text-center py-6">Loading...</div>;
    if (!displayProducts || displayProducts.length === 0) return <div className="text-center py-6">No products available.</div>;

    return (
        <div className="mx-auto">
            <h2 className="text-3xl font-semibold text-center py-8">Featured Products</h2>
            <Carousel className="w-3/4 h-[400px] mx-auto relative">
                <CarouselContent>
                    {displayProducts.map((product) => (
                        <CarouselItem key={product._id}>
                            <div className="p-4 flex justify-center">
                                <Card className="shadow-lg w-full md:w-5/6 lg:w-4/5 transition-transform duration-300 hover:scale-105">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="md:w-1/2 p-4 flex justify-center items-center">

                                            <Image
                                                src={product.image?.url ?? " "}
                                                alt={product.name}
                                                width={250}
                                                height={250}
                                                className="object-contain aspect-square"
                                            />
                                        </div>
                                        
                                        <CardContent className="md:w-1/2 flex flex-col justify-center p-6">
                                            <CardTitle className="text-xl font-semibold mb-2">
                                                {product.name}
                                            </CardTitle>
                                            <CardDescription className="text-sm text-gray-700 mb-4">
                                                {product.short_description || "No description available."}
                                            </CardDescription>
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold">Rs. {product.price}</span>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full shadow-md hover:bg-blue-700 transition-all duration-300" />
                <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full shadow-md hover:bg-blue-700 transition-all duration-300" />
            </Carousel>
        </div>
    );
}
