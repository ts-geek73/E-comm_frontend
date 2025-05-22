"use client"

import { ShoppingBag } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"

import { fetchcart, getAddresses, getLocalCart, saveAddresses } from "@/components/function"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FormValues, ExtendedFormValues } from "@/types/components"
import { ICartresponce } from "@/types/product"
import { useUser } from "@clerk/nextjs"
import { toast } from "react-toastify"
import CheckoutForm from "@/components/CheckOut/CheckOutFOrm"

export default function CheckoutPage() {
    const [cartdata, setCartdata] = useState<ICartresponce | null>(null);
    const { isSignedIn, user, isLoaded } = useUser();
    const [promoCode, setPromoCode] = useState("")
    const rupeeSymbol = "Rs."
    const [promoApplied, setPromoApplied] = useState(false)
    const [savedAddresses, setSavedAddresses] = useState<FormValues[] | null>();

    const fetchAddresses = async () => {
        if (!user?.emailAddresses?.[0]?.emailAddress) {
            console.log("No user email found");
            return;
        }

        try {
            const data = await getAddresses(user.emailAddresses[0].emailAddress);
            console.log("Fetched addresses:", data);
            setSavedAddresses(data?.addresses || []);
        } catch (error) {
            console.error("Failed to fetch addresses", error);
        }
    };
    useEffect(() => {

        fetchAddresses();
    }, [user?.emailAddresses?.[0]?.emailAddress]);





    const loadCart = useCallback(async () => {
        try {
            if (user?.id) {
                const cartData = await fetchcart(user.id);
                setCartdata(cartData);
            } else {
                const cartdata = getLocalCart();
                const localCartData: ICartresponce = {
                    cart: cartdata.products.map(item => ({
                        _id: item.product._id,
                        name: item.product.name,
                        price: item.product.price,
                        image: { url: item.product?.image?.url || "" },
                        qty: item.qty,
                        notes: item.notes || "",
                    })),
                    totalItems: cartdata.products.reduce((sum, item) => sum + item.qty, 0),
                    totalPrice: cartdata.products.reduce((sum, item) => sum + item.qty * item.product.price, 0),
                };
                setCartdata(localCartData);
            }
        } catch (error) {
            console.error("Error loading cart:", error);
            toast.error("Failed to load your cart");
        }
    }, [user?.id]);

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    const applyPromo = () => {
        if (promoCode.toLowerCase() === "discount10") {
            setPromoApplied(true)
            toast.success("Promo code applied successfully!")
        } else {
            toast.error("Invalid promo code")
        }
    }

    const handleCheckoutSubmit = (data: ExtendedFormValues) => {
        console.log("Address data:=", data)
        console.log("CArt Product:=", cartdata);
        console.log("total Price:=", getTotalPrice());


        toast.success("Order placed successfully!")
    }

const handleAddAddress = async (newAddress: FormValues) => {
  if (!user?.emailAddresses?.[0]?.emailAddress) {
    toast.error("User email not found. Cannot save address.");
    return;
  }

  const email = user.emailAddresses[0].emailAddress;

  // Optimistically update UI
  setSavedAddresses(prev => {
    const updatedAddresses = prev ? [...prev, newAddress] : [newAddress];
    
    // Send updated addresses to server
    saveAddresses(email, updatedAddresses)
      .then((savedAddresses) => {
        if (savedAddresses) {
          setSavedAddresses(savedAddresses); // Sync with server response
          toast.success("Address saved successfully!");
        } else {
          toast.error("Failed to save address on server.");
        }
      })
      .catch(() => {
        toast.error("Error saving address.");
      });

    return updatedAddresses; // immediately update UI
  });
};
    

    // Calculate the discounted price if promo is applied
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

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (!isSignedIn) {
        return <div>Sign in to view this page</div>;
    }


    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col-reverse lg:flex-row gap-8">

                <div className="lg:w-2/3">
                    <CheckoutForm
                        onSubmit={handleCheckoutSubmit}
                        savedAddresses={savedAddresses ?? undefined}
                        onAddAddress={handleAddAddress}
                        refreshAddresses={fetchAddresses}

                    />
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="sticky top-8">
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
                    </div>
                </div>
            </div>
        </div>
    )
}