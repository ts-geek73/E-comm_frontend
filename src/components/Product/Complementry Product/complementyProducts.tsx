"use client"

import { Button } from "@components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card"
import { ComplementaryProductsProps, IProductData } from "@types"
import { X } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import ProductBundle from "./ProductBundleComp"
import ProductCard from "../ProductCard"
import QuickView from "./QuickView"
import { toast } from "react-toastify"

export default function ComplementaryProducts({
  products,
  onClose,
  onAddToCart,
  title,
  isVisible = true,
  triggerProduct,
  show = 'list',
  bundleSize = 3,
}: ComplementaryProductsProps) {
  const [showQuickView, setShowQuickView] = useState<string | null>(null)
  const [quickViewProducts, setQuickViewProducts] = useState<IProductData[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleSingleProductAddToCart = async (product: IProductData) => {
    // Show quick view with 4 random products (excluding the clicked one)
    const otherProducts = products.filter(p => p._id !== product._id)
    const randomProducts = otherProducts
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)

    setQuickViewProducts(randomProducts)
    setShowQuickView(product._id)

    await onAddToCart(product)
  }

  const handleBundleAddToCart = async (bundleProducts: IProductData[]) => {
    for (const product of bundleProducts) {
      console.log('Bundle added to cart:',product.name)
      await onAddToCart(product)
    }
    toast.success("Bundle added to cart successfully")
  }

  const handleQuickViewProductClick = (product: IProductData) => {
    console.log('Redirecting to product:', product._id)
  }

  const handleWheel = (e: WheelEvent) => {
    if (scrollRef.current) {
      e.preventDefault()
      scrollRef.current.scrollBy({
        left: e.deltaY * 2, // Adjust scroll speed as needed
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement && isVisible && show === 'list') {
      scrollElement.addEventListener("wheel", handleWheel, { passive: false })

      return () => {
        scrollElement.removeEventListener("wheel", handleWheel)
      }
    }
  }, [isVisible, show])

  if (!isVisible || products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No products available
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="mx-auto px-4">
        <Card className="shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold mb-2 text-blue-600">
                  {title ?? "✨ You might also love these"}
                </CardTitle>
                {triggerProduct && (
                  <p className="text-blue-600 flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Recommended for:{" "}
                    <span className="font-semibold">{triggerProduct.name}</span>
                  </p>
                )}
              </div>
              {onClose && (
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="p-3 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={20} className="text-blue-600" />
                </Button>
              )}
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="p-8">
            {show === 'product_bundle' ? (
              <ProductBundle
                products={products}
                onAddToCart={handleBundleAddToCart}
                bundleSize={bundleSize}
              />
            ) : (
              <div
                className="flex items-center gap-6 overflow-x-auto p-4 hide-scrollbar"
                ref={scrollRef}
              >
                {products.map((product, index) => (
                  <React.Fragment key={product._id + index}>
                    <ProductCard
                      data={product}
                      onAddToCart={handleSingleProductAddToCart}
                    />

                    {/* Quick View - Inline Card */}
                    {showQuickView === product._id && quickViewProducts.length > 0 && (
                      <QuickView
                        products={quickViewProducts}
                        onClose={() => setShowQuickView(null)}
                        onAddToCart={onAddToCart}
                        onProductClick={handleQuickViewProductClick}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}