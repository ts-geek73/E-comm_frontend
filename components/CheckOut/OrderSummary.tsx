"use client"

import { validatePromo } from "@/components/function"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { OrderSummaryProps } from "@/types/components"
import { Loader2, ShoppingBag, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function OrderSummary({
  cartdata,
  setFinalPrice,
  setCoupons
}: OrderSummaryProps) {

  const [promoInput, setPromoInput] = useState("")
  const [promoCodes, setPromoCodes] = useState<string[]>([])
  const [promoApplied, setPromoApplied] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [invalidCodes, setInvalidCodes] = useState<{ code: string; reason: string }[]>([])
  const [showInvalid, setShowInvalid] = useState(false)

  const [discountData, setDiscountData] = useState<{
    originalAmount: number
    discountData: { discount: number, code: string }[]
    totalDiscount: number
    finalAmount: number
  } | null>(null)

  const rupeeSymbol = "Rs."

  const handlePromoAction = async () => {
    const trimmedCode = promoInput.trim().toUpperCase();

    let updatedCodes = [...promoCodes];

    if (trimmedCode) {
      if (promoCodes.includes(trimmedCode)) {
        toast.warn("Promo code already added");
        return;
      }
      updatedCodes.push(trimmedCode);
      setPromoInput("");
    }

    if (updatedCodes.length === 0) {
      toast.warn("Please enter a promo code");
      return;
    }

    setIsApplying(true);

    try {
      const result = await validatePromo(updatedCodes, cartdata?.totalPrice || 0);
      const validDiscounts = result.data.discountData || [];
      const validCodes = validDiscounts.map((d: { code: string }) => d.code);
      const invalidCodes = result.data.invalidPromoCodes || [];

      setPromoCodes(validCodes);
      setDiscountData(result.data);
      setPromoApplied(validDiscounts.length > 0);
      setInvalidCodes(invalidCodes);
      setShowInvalid(invalidCodes.length > 0);
      setFinalPrice(result.data.finalAmount)
      setCoupons(validDiscounts.map((d: { stripeId: string }) => d.stripeId))


    } catch (error: any) {
      toast.warn(error.message || "Failed to apply promo codes");
      setPromoApplied(false);
      setDiscountData(null);
      setInvalidCodes([]);
      setPromoCodes([]);
    } finally {
      setIsApplying(false);
    }
  };


  const handleRemoveCode = async (codeToRemove: string) => {
    const updatedCodes = promoCodes.filter(code => code !== codeToRemove);

    if (updatedCodes.length === 0) {
      setPromoCodes([]);
      setPromoApplied(false);
      setDiscountData(null);
      setInvalidCodes([]);
      return;
    }

    setIsApplying(true);

    try {
      const result = await validatePromo(updatedCodes, cartdata?.totalPrice || 0);
      const validDiscounts = result.data.discountData || [];
      const validCodes = validDiscounts.map((d: { code: string }) => d.code);
      const invalidCodes = result.data.invalidPromoCodes || [];

      setPromoCodes(validCodes);
      setDiscountData(result.data);
      setPromoApplied(validDiscounts.length > 0);
      setInvalidCodes(invalidCodes);
      setShowInvalid(invalidCodes.length > 0);
      setFinalPrice(result.data.finalAmount)

      console.log(validDiscounts.map((d: { stripeId: string }) => d.stripeId));

      setCoupons(validDiscounts.map((d: { stripeId: string }) => d.stripeId))

    } catch (error: any) {
      toast.warn(error.message || "Failed to reapply promo codes");
      setPromoApplied(false);
      setDiscountData(null);
      setInvalidCodes([]);
      setPromoCodes([]);

    } finally {
      setIsApplying(false);
    }
  };

  useEffect(()=>{
    setFinalPrice(getTotalPrice())
  },[cartdata,promoCodes])


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
              placeholder="Enter promo code"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              className="border-blue-200 focus:border-blue-500"
            />
            <Button
              onClick={handlePromoAction}
              disabled={isApplying}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isApplying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Applying...
                </>
              ) : (
                "Apply"
              )}
            </Button>

          </div>

          {discountData && discountData?.discountData?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {discountData?.discountData.map(({ code }: { code: string }) => (
                <span key={code} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded flex items-center">
                  {code}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveCode(code)}
                  />
                </span>
              ))}
            </div>
          )}
        </div>

        {(invalidCodes.length > 0 && showInvalid) && (
          <div className="flex justify-between items-start bg-red-50 border border-red-300 text-red-700 rounded-md px-4 py-2 mt-2 relative">
            <div className="space-y-1 text-sm">
              <p className="font-medium">Invalid Promo Codes:</p>
              <ul className="list-disc ml-5">
                {invalidCodes.map((item, idx) => (
                  <li key={idx}>
                    {item.code} - {item.reason}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setShowInvalid(false)}
              className="text-red-500 hover:text-red-700 ml-4"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}



        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{rupeeSymbol}{cartdata?.totalPrice}</span>
          </div>

          {promoApplied && discountData && (
            <>
              {discountData.discountData.map((d, index) => (
                <div key={index} className="flex items-center justify-between text-green-600 text-sm">
                  <span>{d.code}</span>
                  <span>-{rupeeSymbol}{d.discount}</span>
                </div>
              ))}
              {/* <div className="flex items-center justify-between text-green-600 text-sm">
                  <span>Total Discount</span>
                  <span>-{rupeeSymbol}{discountData.totalDiscount}</span>
                </div> */}
            </>
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
