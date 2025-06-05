"use client"

import CheckoutForm from "@/components/CheckOut/CheckOutFOrm"
import OrderSummary from "@/components/CheckOut/OrderSummary"
import { fetchcart, getAddresses, getLocalCart, makePayMent } from "@/components/Functions/function"
import { ExtendedFormValues, FormValues } from "@/types/components"
import { ICartresponce } from "@/types/product"
import { useUser } from "@clerk/nextjs"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function CheckoutPage() {
    const [cartdata, setCartdata] = useState<ICartresponce | null>(null);
    const { isSignedIn, user, isLoaded } = useUser();
    const [coupons, setCoupons] = useState<string[] | null>(null)
    const [finalPrice, setFinalPrice] = useState<number>(0);
    const [savedAddresses, setSavedAddresses] = useState<FormValues[] | null>();
    const email = user?.emailAddresses?.[0]?.emailAddress;


        const fetchAddresses = async () => {
            try {
                const data = await getAddresses(email as string);
                console.log("Fetched addresses:", data);
                setSavedAddresses(data?.addresses || []);
            } catch (error) {
                console.error("Failed to fetch addresses", error);
            }
        };

    useEffect(() => {
        if (!email) {
            console.log("No user email found");
            return;
        }


        fetchAddresses();
    }, [user, email]); 

    const loadCart = useCallback(async () => {
        try {
            if (user?.id) {
                const cartData = await fetchcart(user.id);
                console.log("cartdata", cartData);

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

    const handleCheckoutSubmit = async (data: ExtendedFormValues) => {
        console.log("Address data:=", data)
        console.log("CArt Product:=", cartdata);
        console.log("finalPrice:=", finalPrice);
        console.log("coupons:=", coupons);

        if (!cartdata || finalPrice === 0) {
            toast.error("Something went wrong. Please try again.");
            return;
        }

        if (coupons && coupons.length > 0) {
            await makePayMent(cartdata, user?.emailAddresses?.[0]?.emailAddress as string, finalPrice, data, coupons)
        } else {
            await makePayMent(cartdata, user?.emailAddresses?.[0]?.emailAddress as string, finalPrice, data)
        }

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
                            setCoupons={setCoupons}
                            setFinalPrice={setFinalPrice}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}