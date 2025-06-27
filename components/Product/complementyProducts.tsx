"use client"

import { ComplementaryProductsProps, IProductData } from "@/types/product"
import { ShoppingCart, X, Plus, Heart } from "lucide-react"
import Image from "next/image"
import React from "react"
import { useRef, useState, useEffect } from "react"

export default function ComplementaryProducts({
  products,
  onClose,
  onAddToCart,
  title,
  isVisible = true,
  triggerProduct,
}: ComplementaryProductsProps) {
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [showQuickView, setShowQuickView] = useState<string | null>(null)
  const [quickViewProducts, setQuickViewProducts] = useState<IProductData[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleAddToCart = async (product: IProductData) => {
    setAddingToCart(product._id)

    // Show quick view with 4 random products (excluding the clicked one)
    const otherProducts = products.filter(p => p._id !== product._id)
    const randomProducts = otherProducts
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)

    setQuickViewProducts(randomProducts)
    setShowQuickView(product._id)

    await onAddToCart(product)
    setAddingToCart(null)
  }

  const handleQuickViewProductClick = (product: IProductData) => {
    console.log('Redirecting to product:', product._id)
  }

  const handleWheel = (e: WheelEvent) => {
    if (scrollRef.current) {
      e.preventDefault()
      const scrollAmount = e.deltaY * 2

      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement && isVisible) {
      scrollElement.addEventListener("wheel", handleWheel, { passive: false })

      return () => {
        scrollElement.removeEventListener("wheel", handleWheel)
      }
    }
  }, [isVisible])

  if (!isVisible || products.length === 0) return <div className="text-center py-8 text-gray-500">No products available</div>

  return (
    <div className=" py-8">
      <div className="mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-50 px-8 py-6 text-blue-600">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {title ?? "✨ You might also love these"}
                </h2>
                {triggerProduct && (
                  <p className="text-indigo-100 flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                    Recommended for: <span className="font-semibold text-white">{triggerProduct.name}</span>
                  </p>
                )}
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-3 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
                >
                  <X size={20} className="text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Products Section */}
          <div className="p-8">
            <div
              className="flex gap-6 overflow-x-auto pb-4"
              ref={scrollRef}
            >
              {products.map((product, index) => (
                <React.Fragment key={product._id + index}>
                  {/* Product Card */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:border-indigo-300 w-[250px] flex-shrink-0 group">
                    {/* Product Image */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-4 overflow-hidden">
                      <Image
                        src={product.image?.url || "/placeholder.svg?height=200&width=200"}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3">
                      <div className="flex items-start  gap-2">
                        <h3 className="font-semibold text-gray-900 min-h-[30px]  text-base leading-tight line-clamp-2 flex-1">
                          {product.name}
                        </h3>
                        <button className="text-gray-400 hover:text-red-500 transition-colors p-1">
                          <Heart size={18} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex flex-col">
                          <span className="font-bold text-blue-600 text-lg">
                            ₹{product.price}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={addingToCart === product._id}
                        className="w-full bg-blue-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-3 transition-all duration-200"
                      >
                        {addingToCart === product._id ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <ShoppingCart size={18} />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Quick View - Inline Card */}
                  {showQuickView === product._id && quickViewProducts.length > 0 && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-indigo-200 rounded-xl p-5 w-[350px] flex-shrink-0">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-indigo-900 text-lg flex items-center gap-2">
                          🔥 More Picks
                        </h4>
                        <button
                          onClick={() => setShowQuickView(null)}
                          className="p-2 hover:bg-indigo-100 rounded-full transition-colors"
                        >
                          <X size={18} className="text-indigo-600" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {quickViewProducts.slice(0, 4).map((qProduct, qIndex) => (
                          <div
                            key={qProduct._id + qIndex}
                            className="bg-white border border-indigo-100 rounded-lg p-3 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-indigo-300"
                            onClick={() => handleQuickViewProductClick(qProduct)}
                          >
                            <div className="bg-gray-50 rounded-lg overflow-hidden mb-2">
                              <Image
                                src={qProduct.image?.url || "/placeholder.svg?height=100&width=100"}
                                alt={qProduct.name}
                                width={100}
                                height={100}
                                className="w-full h-20 object-cover"
                              />
                            </div>
                            
                            <h5 className="text-xs font-semibold text-gray-800 line-clamp-2 mb-2">
                              {qProduct.name}
                            </h5>
                            
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-bold text-blue-600">
                                ₹{qProduct.price}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAddToCart(qProduct);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}