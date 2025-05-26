"use client"

import CheckoutForm from "@/components/CheckOut/CheckOutFOrm"
import OrderSummary from "@/components/CheckOut/OrderSummary"
import { fetchcart, getAddresses, getLocalCart } from "@/components/function"
import { ExtendedFormValues, FormValues } from "@/types/components"
import { ICartresponce } from "@/types/product"
import { useUser } from "@clerk/nextjs"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function CheckoutPage() {
    const [cartdata, setCartdata] = useState<ICartresponce | null>(null);
    const { isSignedIn, user, isLoaded } = useUser();
    const [promoCode, setPromoCode] = useState("")
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

    const handleCheckoutSubmit = (data: ExtendedFormValues) => {
        console.log("Address data:=", data)
        console.log("CArt Product:=", cartdata);
        console.log("total Price:=", getTotalPrice());


        toast.success("Order placed successfully!")
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
                        refreshAddresses={fetchAddresses}

                    />
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="sticky top-8">
                        <OrderSummary
                            cartdata={cartdata}
                            promoCode={promoCode}
                            setPromoCode={setPromoCode}
                            promoApplied={promoApplied}
                            setPromoApplied={setPromoApplied}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}