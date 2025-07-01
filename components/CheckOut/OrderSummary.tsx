"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderSummaryProps } from "@/types/components"
import { AlertTriangle, ShoppingBag } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { validatePromo } from "../Functions/promocode"
import PromoCodeComp, { renderCartItem } from "./PromoCodeComponent"

export default function OrderSummary({ cartdata, setFinalPrice, setCoupons }: OrderSummaryProps) {
  const [appliedCodes, setAppliedCodes] = useState<string[]>([])
  const [invalidCodes, setInvalidCodes] = useState<{ code: string; reason: string }[]>([])
  const [discountData, setDiscountData] = useState<{
    originalAmount: number
    discountData: { discount: number, code: string, stripeId: string }[]
    totalDiscount: number
    finalAmount: number
  } | null>(null)
  const [isApplying, setIsApplying] = useState(false)
  const [showInvalid, setShowInvalid] = useState(false)

  const rupeeSymbol = "Rs."
  const hasInStockItems = cartdata?.inStock && cartdata.inStock.length > 0

  const handleApplyPromo = async (code: string) => {
    const updatedCodes = [...appliedCodes, code]
    setIsApplying(true)

    try {
      const result = await validatePromo(updatedCodes, cartdata?.totalPrice || 0)
      const validDiscounts = result.data.discountData || []
      const validCodes = validDiscounts.map((d: { code: string }) => d.code)
      const invalidPromoCodes = result.data.invalidPromoCodes || []

      setAppliedCodes(validCodes)
      setDiscountData(result.data)
      setInvalidCodes(invalidPromoCodes)
      setShowInvalid(invalidPromoCodes.length > 0)
      setFinalPrice(result.data.finalAmount)
      setCoupons(validDiscounts.map((d: { stripeId: string }) => d.stripeId))

      if (validCodes.includes(code)) {
        toast.success(`Promo code ${code} applied successfully!`)
      }
    } catch (error) {
      console.log("error:", error)
      toast.error("Failed to apply promo code")
    } finally {
      setIsApplying(false)
    }
  }

  const handleRemovePromo = async (codeToRemove: string) => {
    const updatedCodes = appliedCodes.filter(code => code !== codeToRemove)
    setIsApplying(true)

    if (updatedCodes.length === 0) {
      setAppliedCodes([])
      setDiscountData(null)
      setInvalidCodes([])
      setFinalPrice(cartdata?.totalPrice || 0)
      setCoupons([])
      setIsApplying(false)
      toast.info(`Promo code ${codeToRemove} removed`)
      return
    }

    try {
      const result = await validatePromo(updatedCodes, cartdata?.totalPrice || 0)
      const validDiscounts = result.data.discountData || []
      const validCodes = validDiscounts.map((d: { code: string }) => d.code)
      const invalidPromoCodes = result.data.invalidPromoCodes || []

      setAppliedCodes(validCodes)
      setDiscountData(result.data)
      setInvalidCodes(invalidPromoCodes)
      setShowInvalid(invalidPromoCodes.length > 0)
      setFinalPrice(result.data.finalAmount)
      setCoupons(validDiscounts.map((d: { stripeId: string }) => d.stripeId))
      
      toast.info(`Promo code ${codeToRemove} removed`)
    } catch (error) {
      console.log("error:", error)
      toast.error("Failed to update promo codes")
    } finally {
      setIsApplying(false)
    }
  }

  const getFinalAmount = useCallback(() => {
    return discountData?.finalAmount || cartdata?.totalPrice || 0
  }, [discountData?.finalAmount, cartdata?.totalPrice])

  useEffect(() => {
    setFinalPrice(getFinalAmount())
  }, [getFinalAmount, setFinalPrice])



  return (
    <Card className="border-blue-100 shadow-md">
      <CardHeader className="bg-blue-50 rounded-t-lg border-b border-blue-100">
        <CardTitle className="flex items-center gap-2 text-blue-600">
          <ShoppingBag className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">

        {!hasInStockItems && (
          <div className="bg-orange-50 border border-orange-200 text-orange-700 rounded-md px-4 py-3">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p className="font-medium">Cannot proceed to checkout</p>
            </div>
            <p className="text-sm mt-1">All items in your cart are currently out of stock.</p>
          </div>
        )}

        {cartdata?.inStock && cartdata.inStock.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-green-700 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Available Items ({cartdata.inStock.length})
            </h3>
            {cartdata.inStock.map((item) => renderCartItem(item, rupeeSymbol,false))}
          </div>
        )}

        {/* Out-of-Stock Items Section */}
        {cartdata?.outOfStock && cartdata.outOfStock.length > 0 && (
          <div className="space-y-3 mt-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-medium text-red-700 flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Unavailable Items ({cartdata.outOfStock.length})
              </h3>
              <div className="space-y-3">
                {cartdata.outOfStock.map((item) => renderCartItem(item, rupeeSymbol, true))}
              </div>
              <div className="mt-3 text-sm text-red-600 bg-red-100 p-2 rounded">
                <p className="font-medium">Note:</p>
                <p>These items are currently out of stock and will not be included in your order.</p>
              </div>
            </div>
          </div>
        )}

        {hasInStockItems && (
          <PromoCodeComp
            appliedCodes={appliedCodes}
            onApplyPromo={handleApplyPromo}
            onRemovePromo={handleRemovePromo}
            isApplying={isApplying}
            invalidCodes={invalidCodes}
            showInvalid={showInvalid}
            onHideInvalid={() => setShowInvalid(false)}
          />
        )}

        {hasInStockItems && (
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{rupeeSymbol}{cartdata?.totalPrice}</span>
            </div>

            {discountData && discountData.discountData?.length > 0 && (
              <>
                {discountData.discountData.map((d) => (
                  <div key={d.code} className="flex items-center justify-between text-green-600 text-sm">
                    <span className="flex items-center">
                      <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                      {d.code} discount
                    </span>
                    <span>-{rupeeSymbol}{d.discount}</span>
                  </div>
                ))}
              </>
            )}

            <div className="border-t border-gray-200 pt-3 mt-2" />

            <div className="flex items-center justify-between font-medium text-lg text-blue-700">
              <span>Total</span>
              <span>{rupeeSymbol}{getFinalAmount()}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}