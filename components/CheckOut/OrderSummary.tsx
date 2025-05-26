"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { OrderSummaryProps } from "@/types/components"
import { ShoppingBag } from "lucide-react"
import Image from "next/image"
import { toast } from "react-toastify"
import { validatePromo } from "@/components/function"

export default function OrderSummary({
  cartdata,
  promoCode,
  setPromoCode,
  promoApplied,
  setPromoApplied,
  setFinalAmount
}: OrderSummaryProps) {

  const rupeeSymbol = "Rs."
  const [discountData, setDiscountData] = useState<{
    originalAmount: number
    discount: number
    finalAmount: number
  } | null>(null)

  const applyPromo = async () => {
    if (!promoCode) return toast.warn("Please enter a promo code.")
    try {
      const result = await validatePromo(promoCode, cartdata?.totalPrice || 0)      
      setDiscountData(result.data)
      setPromoApplied(true)
      setFinalAmount(result.data.finalAmount); 
      toast.success("Promo code applied!")
    } catch (error: any) {
      toast.error(error.message || "Failed to apply promo code.")
      setPromoApplied(false)
      setDiscountData(null)
    }
  }

useEffect(() => {
  if (!promoApplied && cartdata?.totalPrice != null) {
    setFinalAmount(cartdata.totalPrice);
  }
}, [cartdata, promoApplied]);

  const getTotalPrice = () => {
    return discountData?.finalAmount || cartdata?.totalPrice || 0
  }

  return (
    <Card className="border-blue-100 shadow-md">
      <CardHeader className="bg-blue-50 rounded-t-lg border-b border-blue-100">
        <CardTitle className="flex items-center gap-2 text-blue-600">
          <ShoppingBag className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {cartdata?.cart.map((item) => (
          <div key={item._id} className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center space-x-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-md border border-gray-200">
                <Image src={item.image.url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </div>
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                <p className="text-xs text-gray-500 font-medium">{rupeeSymbol}{item.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-blue-500">{rupeeSymbol}{(item.price * item.qty).toFixed(2)}</p>
            </div>
          </div>
        ))}

        {/* Promo Code Section */}
        <div className="space-y-2 pt-2">
          <div className="flex gap-2">
            <Input
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="border-blue-200 focus:border-blue-500"
            />
            <Button
              variant="outline"
              onClick={applyPromo}
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              Apply
            </Button>
          </div>
          {promoApplied && discountData && (
            <p className="text-xs text-green-600">{`Promo code "${promoCode}" applied: You saved ${rupeeSymbol}${discountData.discount}!`}</p>
          )}
        </div>

        {/* Price Summary */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{rupeeSymbol}{cartdata?.totalPrice}</span>
          </div>

          {promoApplied && discountData && (
            <div className="flex items-center justify-between text-green-600 text-sm">
              <span>Discount</span>
              <span>-{rupeeSymbol}{discountData.discount}</span>
            </div>
          )}

          <div className="border-t border-gray-200 pt-3 mt-2"></div>

          <div className="flex items-center justify-between font-medium text-blue-700">
            <span>Total</span>
            <span>{rupeeSymbol}{getTotalPrice()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
