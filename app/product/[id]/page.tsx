'use client';

import { addToCart } from "@/components/Functions/cart-address";
import { handleWishlistToggle } from "@/components/Functions/review-whishlist";
import ComplementaryProducts from "@/components/Product/complementyProducts";
import MarkdownConverter from "@/components/Product/markDown";
import ProductCard from "@/components/Product/ProductCard";
import ProductDetailComponent from "@/components/Product/ProductDetails";
import { ProductImageGallery } from "@/components/Product/ProductGallery";
import MultiReviewProduct from "@/components/Review/MainReview";
import { useProductDetails } from "@/hooks";
import { IProductData } from "@/types/product";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";


const ProductDetails: React.FC = () => {
    const router = useRouter();
    const { id } = useParams() as { id: string };
    const { user } = useUser();
    const userId: string = user ? user?.id : " ";

    const { product, relatedProducts, isWishlisted, toggleWishlist } = useProductDetails(id);

    const [complementaryProducts, setComplementaryProducts] = useState<IProductData[]>([])
    const [showComplementaryProducts, setShowComplementaryProducts] = useState<boolean>(false)

    const handleComplementaryProductsFetched = (products: IProductData[]) => {
        setComplementaryProducts(products)
        setShowComplementaryProducts(true)
    }

    const handleComplementaryAddToCart = async (product: IProductData) => {
        try {
            const response = await addToCart(product, 1, userId)
            if (response) {
                toast.success(`${product.name} added to cart`)
            }
        } catch (error) {
            console.error("Error adding complementary product to cart:", error)
            toast.error("Failed to add product to cart")
        }
    }

    if (!product) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-12">


            <div className="max-w-7xl mt-4 mx-auto px-4">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
                    <div className="grid md:grid-cols-2 gap-0">
                        <ProductImageGallery images={product.images || []} />

                        <ProductDetailComponent
                            isWishlisted={isWishlisted}
                            toggleWishlist={toggleWishlist}
                            product={product}
                            handleComplementaryProductsFetched={handleComplementaryProductsFetched}
                        />

                    </div>
                </div>

                {showComplementaryProducts && (
                    <ComplementaryProducts
                        products={complementaryProducts}
                        isVisible={showComplementaryProducts}
                        onClose={() => setShowComplementaryProducts(false)}
                        onAddToCart={handleComplementaryAddToCart}
                    />
                )}

                <div className="bg-white rounded-xl shadow-sm p-6 px-8 mb-12">
                    <h1 className="text-5xl font-bold text-gray-800 mb-4">Product Description</h1>
                    <MarkdownConverter markdownText={product.long_description} />
                </div>

                {relatedProducts && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-12">
                        <div className="flex justify-center items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Related Products</h2>
                        </div>

                        <div className="grid place-items-center gap-3 grid-flow-col ">
                            {relatedProducts.length === 0 && (
                                <div className="text-gray-500 text-lg">No related products found.</div>
                            )}
                        </div>

                        <div className="grid place-items-center gap-3 grid-flow-col ">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard
                                    key={relatedProduct._id}
                                    data={relatedProduct}
                                    onClick={() => router.push(`/product/${relatedProduct._id}`)}
                                    onWishlistToggle={(product, isWishlisted) =>
                                        handleWishlistToggle(product, userId, isWishlisted)
                                    } />
                            ))}
                        </div>
                    </div>
                )}

                <MultiReviewProduct
                    productId={id}
                />
            </div>
        </div>
    );
};

export default ProductDetails;