"use client";

import { useCart } from "@/context/cart";
import { useUser } from "@clerk/nextjs";
import CheckoutForm from "@components/CheckOut/CheckOutFOrm";
import OrderSummary from "@components/CheckOut/OrderSummary";
import {
  fetchcart,
  getAddresses,
  getLocalCart,
  makePayMent,
} from "@components/Functions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExtendedFormValues, ICartresponce } from "@types";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const { setCount } = useCart();
  const queryClient = useQueryClient();

  const [coupons, setCoupons] = useState<string[] | null>(null);
  const [finalPrice, setFinalPrice] = useState<number>(0);

  const { data: addressesData, refetch: refetchAddresses } = useQuery({
    queryKey: ["addresses", email],
    queryFn: () => getAddresses(email as string),
    enabled: !!email, // Only fetch when email is available
  });

  const savedAddresses = addressesData?.addresses ?? [];

  const { data: cartdata } = useQuery<ICartresponce>({
    queryKey: ["cart", user?.id],
    queryFn: async () => {
      if (user?.id) {
        const cart = await fetchcart(user.id);
        setCount(cart.inStock.length);
        return cart;
      } else {
        const localCart = getLocalCart();
        return {
          cart: localCart.products.map((item) => ({
            _id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            image: { url: item.product?.image?.url || "" },
            qty: item.qty,
            notes: item.notes || "",
          })),
          totalItems: localCart.products.reduce(
            (sum, item) => sum + item.qty,
            0
          ),
          totalPrice: localCart.products.reduce(
            (sum, item) => sum + item.qty * item.product.price,
            0
          ),
        };
      }
    },
    enabled: isLoaded, // Only fetch after user status is known
  });

  const { mutate: checkoutMutate } = useMutation({
    mutationFn: (data: ExtendedFormValues) => {
      if (!cartdata) throw new Error("No cart data available");

      return makePayMent(
        cartdata,
        email as string,
        finalPrice,
        data,
        coupons ?? []
      );
    },
    onSuccess: () => {
      toast.success("Payment initiated successfully");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast.error("Payment failed, please try again");
    },
  });

  const handleCheckoutSubmit = (data: ExtendedFormValues) => {
    if (
      !cartdata ||
      finalPrice === 0 ||
      (cartdata.inStock && cartdata.inStock.length <= 0)
    ) {
      toast.error("Cart is empty or price is invalid");
      return;
    }
    checkoutMutate(data);
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Sign in to view this page</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col-reverse lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <CheckoutForm
            onSubmit={handleCheckoutSubmit}
            savedAddresses={savedAddresses ?? undefined}
            refreshAddresses={() => refetchAddresses().then(() => {})}
          />
        </div>

        <div className="lg:w-1/3">
          <div className="sticky top-8 h-fit border border-red-500 bg-yellow-100">
            <OrderSummary
              cartdata={cartdata ?? null}
              setCoupons={setCoupons}
              setFinalPrice={setFinalPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
