
import AddToCartSection from "@/components/Product/AddToCart";
import { IProductData } from "@/types/product";
import { Shield, TruckIcon } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductDetailComponent: React.FC<{
    product: IProductData,
    toggleWishlist:()=>void
    isWishlisted: boolean
    handleComplementaryProductsFetched: (products: IProductData[]) => void
}> = ({
    product,
    toggleWishlist,
    isWishlisted,
    handleComplementaryProductsFetched
}) => {
        return (
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
                        <AddToCartSection
                            product={product}
                            onComplementaryProductsFetched={handleComplementaryProductsFetched}
                        />
                    )}
                </div>
            </div>
        );
    }

export default ProductDetailComponent;