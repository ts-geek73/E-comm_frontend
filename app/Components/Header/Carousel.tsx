import * as React from "react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const productData = [
    {
        id: 1,
        title: "Stylish Smartwatch",
        description: "Track your fitness and stay connected.",
        image: "/product.png",
        price: "199.99 Rs",
    },
    {
        id: 2,
        title: "Wireless Headphones",
        description: "Immersive sound with noise cancellation.",
        image: "/product.png",
        price: "149.99 Rs",
    },
    {
        id: 3,
        title: "Portable Bluetooth Speaker",
        description: "Take your music anywhere with this powerful speaker.",
        image: "/product.png",
        price: "79.99 Rs",
    },
    {
        id: 4,
        title: "Ergonomic Office Chair",
        description: "Comfort and support for long work hours.",
        image: "/product.png",
        price: "249.99 Rs",
    },
    {
        id: 5,
        title: "High-Performance Laptop",
        description: "Powerful and portable for all your needs.",
        image: "/product.png",
        price: "1299.99 Rs",
    },
];

export default function EcommerceCarousel() {
    return (

        <div className="mx-auto ">
            <h2 className="text-3xl font-semibold text-center my-8">Featured Products</h2>
            <Carousel className="w-3/4 h-[400px] mx-auto relative">
                <CarouselContent>
                    {productData.map((product) => (
                        <CarouselItem key={product.id}>
                            <div className="p-4 flex justify-center">
                                <Card className="shadow-lg w-full md:w-5/6 lg:w-4/5 transition-transform duration-300 hover:scale-105">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="md:w-1/2 p-4 flex justify-center items-center">
                                            <Image
                                                src={product.image}
                                                alt={product.title}
                                                width={250}
                                                height={250}
                                                className="object-contain aspect-square"
                                            />
                                        </div>
                                        
                                        <CardContent className="md:w-1/2 flex flex-col justify-center p-6">
                                            <CardTitle className="text-xl font-semibold mb-2">
                                                {product.title}
                                            </CardTitle>
                                            <CardDescription className="text-sm text-gray-700 mb-4">
                                                {product.description}
                                            </CardDescription>
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold">{product.price}</span>
                                                <Button size="sm">Add to Cart</Button>
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