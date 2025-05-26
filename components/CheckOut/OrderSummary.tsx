"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { OrderSummaryProps } from "@/types/components"
import { ShoppingBag } from "lucide-react"
import Image from "next/image"
import { toast } from "react-toastify"


export default function OrderSummary({
    cartdata,
    promoCode,
    setPromoCode,
    promoApplied,
    setPromoApplied,
}: OrderSummaryProps) {
    const rupeeSymbol = "Rs."

    const applyPromo = () => {
        if (promoCode.toLowerCase() === "discount10") {
            setPromoApplied(true)
            toast.success("Promo code applied successfully!")
        } else {
            toast.error("Invalid promo code")
        }
    }

    const getDiscountAmount = () => {
        if (promoApplied && cartdata) {
            return cartdata.totalPrice * 0.1
        }
        return 0
    }

    const getTotalPrice = () => {
        if (cartdata) {
            return promoApplied ? cartdata.totalPrice * 0.9 : cartdata.totalPrice
        }
        return 0
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
                    {promoApplied && (
                        <p className="text-xs text-green-600">{`Promo code "DISCOUNT10" applied successfully!`}</p>
                    )}
                    {promoCode && !promoApplied && (
                        <p className="text-xs text-gray-500">{`Try "DISCOUNT10" for 10% off`}</p>
                    )}
                </div>

                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{rupeeSymbol}{cartdata?.totalPrice.toFixed(2)}</span>
                    </div>

                    {promoApplied && (
                        <div className="flex items-center justify-between text-green-600 text-sm">
                            <span>Discount (10%)</span>
                            <span>-{rupeeSymbol}{getDiscountAmount().toFixed(2)}</span>
                        </div>
                    )}

                    <div className="border-t border-gray-200 pt-3 mt-2"></div>

                    <div className="flex items-center justify-between font-medium text-blue-700">
                        <span>Total</span>
                        <span>{rupeeSymbol}{getTotalPrice().toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
