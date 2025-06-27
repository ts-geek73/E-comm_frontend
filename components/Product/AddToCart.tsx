"use client"

import useProductDetail from "@/hooks/useProductDetails"
import type { IProductData } from "@/types/product"
import { useUser } from "@clerk/nextjs"
import { ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { addToCart, getLocalCart } from "../Functions/cart-address"

export default function AddToCartSection({ product, onComplementaryProductsFetched }: 
  {
  product: IProductData
  onComplementaryProductsFetched?: (products: IProductData[]) => void
}
) {
  const [quantity, setQuantity] = useState<number>(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { user } = useUser()
  const user_id = user ? user?.id : ""
  const {relatedProducts} = useProductDetail(product._id)
  
  useEffect(() => {
    const cart = getLocalCart()
    const qtnty = cart.products.find((item) => item.product._id.toString() === product._id.toString())
    setQuantity(qtnty?.qty ?? 1)
  }, [product._id])

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => {
      const newQty = prev + change
      if (newQty < 0) return 0
      return newQty
    })
  }

  const fetchComplementaryProducts = async () => {
    try {
        if (relatedProducts && onComplementaryProductsFetched) {
          onComplementaryProductsFetched(relatedProducts)
        }
    } catch (error) {
      console.error("Error fetching complementary products:", error)
    }
  }

  const handleAddToCart = async () => {
    console.log("Adding to cart:", { product_id: product._id, quantity })
    setIsAddingToCart(true)

    try {
      const response = await addToCart(product, quantity, user_id)

      if (response) {
        toast.success(`${product.name} added to cart`)
        await fetchComplementaryProducts()
      }
    } catch (error) {
      console.log("Cart added Error: ", error)
      toast.error("Failed to add product to cart")
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center border border-gray-300 rounded-lg">
        <button
          onClick={() => handleQuantityChange(-1)}
          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg disabled:opacity-50"
          disabled={quantity <= 1 || isAddingToCart}
        >
          -
        </button>
        <span className="w-16 text-center flex items-center justify-center border-x border-gray-300">{quantity}</span>
        <button
          onClick={() => handleQuantityChange(1)}
          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg disabled:opacity-50"
          disabled={isAddingToCart}
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isAddingToCart}
        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-5 rounded-lg flex items-center justify-center transition-colors"
      >
        {isAddingToCart ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
        ) : (
          <ShoppingCart size={20} className="mr-2" />
        )}
        {isAddingToCart ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  )
}
