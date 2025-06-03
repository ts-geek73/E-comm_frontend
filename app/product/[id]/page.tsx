'use client';

import { handleWishlistToggle } from "@/components/function";
import AddToCartSection from "@/components/Product/AddToCart";
import ProductCard from "@/components/Product/ProductCard";
import { ProductImageGallery } from "@/components/Product/ProductGallery";
import MultiReviewProduct from "@/components/Review/MainReview";
import { useProductDetails } from "@/hooks";
import { useUser } from "@clerk/nextjs";
import {
    Shield,
    TruckIcon
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FaHeart, FaRegHeart } from "react-icons/fa";


const ProductDetails: React.FC = () => {
    const router = useRouter();
    const { id } = useParams() as { id: string };
    const { user } = useUser();
    const userId: string = user ? user?.id : " ";

    const { product, relatedProducts, isWishlisted, toggleWishlist } = useProductDetails(id);

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
                {/* Main Product Section */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
                    <div className="grid md:grid-cols-2 gap-0">

                        {/* Image Gallery */}

                        <ProductImageGallery images={product.images || []} />


                        <div className="p-6 md:p-8 flex flex-col">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                        {product.categories.map((cat) => cat.name).join(", ")}
                                    </span>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2 mb-1">{product.name}</h1>

                                    <p className="text-gray-500 text-sm mb-2">Brand:
                                        <span className="font-medium text-gray-700">{product.brands.map((brand) => brand.name) ?? "unknown"}
                                        </span></p>
                                </div>

                                <button
                                    onClick={() => toggleWishlist()}
                                    className="ml-4 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
                                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                                >
                                    {isWishlisted ? (
                                        <FaHeart className="text-red-600 w-5 h-5" />
                                    ) : (
                                        <FaRegHeart className="text-gray-500 w-5 h-5" />
                                    )}
                                </button>

                            </div>

                            <div className="mt-2 mb-6">
                                <p className="text-gray-600">{product?.short_description || product.description}</p>
                            </div>

                            <div className="mt-auto">
                                <div className="flex items-baseline mb-4">
                                    <span className="text-3xl font-bold text-gray-900">Rs. {product.price}</span>
                                    <span className="ml-2 text-sm text-gray-500">Including all taxes</span>
                                </div>

                                <div className="flex items-center mb-6">

                                </div>

                                <div className="flex flex-col gap-2 mb-6 bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center text-sm">
                                        <TruckIcon size={16} className="text-gray-500 mr-2" />
                                        <span>
                                            <span className="font-medium">Free delivery</span> within 2-5 business days
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Shield size={16} className="text-gray-500 mr-2" />
                                        <span>
                                            <span className="font-medium">1 Year warranty</span> on all products
                                        </span>
                                    </div>
                                </div>

                                {product && (
                                    <AddToCartSection product={product} />
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Description</h2>
                    <div className="text-gray-600">
                        <p className="mb-4" dangerouslySetInnerHTML={{ __html: product.long_description }}></p>

                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-12">
                        <div className="flex justify-center items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Related Products</h2>
                            <div className="flex space-x-2">

                            </div>
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

                {/* Review Section */}
                <MultiReviewProduct
                    productId={id}
                />
            </div>
        </div>
    );
};

export default ProductDetails;