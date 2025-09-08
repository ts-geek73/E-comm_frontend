import { Button } from "@components/ui/button"
import { IProductData } from "@types"
import { Plus, ShoppingCart } from "lucide-react"
import Image from "next/image"
import React from "react"

const ProductBundle = ({
  products,
  onAddToCart,
  bundleSize = 3
}: {
  products: IProductData[]
  onAddToCart: (products: IProductData[]) => Promise<void>
  bundleSize?: number
}) => {
  const bundleProducts = products.slice(0, bundleSize)
  const totalPrice = bundleProducts.reduce((sum, product) => sum + product.price, 0)

  const handleBundleAddToCart = async () => {
    await onAddToCart(bundleProducts)
  }

  return (
    <div className="w-full grid grid-cols-[3fr_1fr] max-w-4xl mx-auto">

      <div className="flex items-center justify-center gap-4 mb-6">
        {bundleProducts.map((product, index) => (
          <React.Fragment key={product._id}>
            <div className="flex flex-col items-center">
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200 hover:border-blue-300 transition-all">
                <Image
                  src={product.image?.url || "/placeholder.svg?height=120&width=120"}
                  alt={product.name}
                  width={120}
                  height={120}
                  className="w-20 h-20 object-cover rounded-md"
                />
              </div>
              <h3 className="text-sm font-medium text-gray-800 mt-2 min-h-[40px] text-center max-w-24 line-clamp-2">
                {product.name}
              </h3>
            </div>

            {index < bundleProducts.length - 1 && (
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 rounded-full p-2">
                  <Plus size={16} className="text-blue-600" />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-col">
        <div className="flex flex-col  bg-white py-2 mb-4">

          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Bundle Price: <span className="text-lg font-bold ml-4 text-green-600">₹{Math.round(totalPrice)}</span>
          </h2>
          <h3 className="text-md  text-gray-800 mb-2">
            Original Price: <span className="text-sm text-gray-500 line-through">₹{Math.round(totalPrice * 1.2)}</span>
          </h3>
          <p className="text-xs text-gray-600">You save ₹{Math.round(totalPrice) * 0.2}</p>
        </div>

        <Button
          onClick={handleBundleAddToCart}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 flex items-center gap-2"
        >
          <ShoppingCart size={16} />
          Add Bundle to Cart
        </Button>
      </div>
    </div>
  )
}

export default ProductBundle;