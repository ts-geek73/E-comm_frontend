"use client";

import { useCart } from "@/context/cart";
import { useProductFetch } from "@/hooks";
import { useUser } from "@clerk/nextjs";
import CartItemBox from "@components/CheckOut/CartItemBox";
import {
  addToCart,
  clearCart,
  fetchcart,
  getLocalCart,
  removeFromCart,
} from "@components/Functions";
import OrderSummery from "@components/order/OrderSummery";
import ComplementaryProducts from "@components/Product/Complementry Product/complementyProducts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ICartresponce, IProductData } from "@types";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CartPage() {
  const { user } = useUser();
  const user_id = user ? user.id : "";
  const rupeeSymbol = "Rs.";
  const { products } = useProductFetch(1, 5);
  // const { addToCartProvider, removeFromCartProvider, syncCartProvider, clearCartProvider } = useCart()
  const { setCount } = useCart();

  const queryClient = useQueryClient();
  const [itemsBeingUpdated, setItemsBeingUpdated] = useState<Set<string>>(
    new Set()
  );

  const { data: cartdata, isLoading: cartLoading } = useQuery<ICartresponce>({
    queryKey: ["cart", user_id],
    queryFn: async () => {
      if (user_id) {
        const cartData = await fetchcart(user_id);
        // syncCartProvider([...cartData.inStock, ...cartData.outOfStock])
        setCount(cartData.inStock.length + cartData.outOfStock.length);
        return {
          cart: [...cartData.inStock, ...cartData.outOfStock],
          totalItems: cartData.totalItems,
          totalPrice: cartData.totalPrice,
        };
      } else {
        const localCart = getLocalCart();
        const localCartData: ICartresponce = {
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
        setCount(localCartData.cart?.length ?? 0);
        return localCartData;
      }
    },
    enabled: user !== undefined, // only run after user is loaded
  });

  const { mutateAsync: mutateQuantityChange } = useMutation({
    mutationFn: async ({
      productId,
      newQuantity,
    }: {
      productId: string;
      newQuantity: number;
    }) => {
      const item =
        cartdata &&
        cartdata.cart &&
        cartdata?.cart.find((item) => item._id === productId);
      if (!item) throw new Error("Product not found");
      await addToCart(item, newQuantity, user_id);
      // addToCartProvider({ productId: item._id, qty: newQuantity })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", user_id] });
      setCount((prev) => prev);
    },
    onError: () => {
      toast.error("Failed to update quantity");
    },
  });

  const handleQuantityChange = async (productId: string, change: number) => {
    const item =
      cartdata &&
      cartdata.cart &&
      cartdata?.cart.find((item) => item._id === productId);
    if (!item) return;
    const newQuantity = item.qty + change;
    if (newQuantity < 1) return;

    setItemsBeingUpdated((prev) => new Set(prev).add(productId));

    try {
      await mutateQuantityChange({ productId, newQuantity });
    } finally {
      setItemsBeingUpdated((prev) => {
        const updated = new Set(prev);
        updated.delete(productId);
        return updated;
      });
    }
  };

  const { mutateAsync: removeItemMutate } = useMutation({
    mutationFn: (productId: string) => removeFromCart(productId, user_id),
    onSuccess: () => {
      setCount((prev) => Math.max(prev - 1, 0));
      queryClient.invalidateQueries({ queryKey: ["cart", user_id] });
      toast.success("Item removed from cart");
    },
    onError: () => {
      toast.error("Failed to remove item");
    },
  });

  const handleRemoveItem = async (productId: string) => {
    setItemsBeingUpdated((prev) => new Set(prev).add(productId));
    try {
      await removeItemMutate(productId);
    } finally {
      setItemsBeingUpdated((prev) => {
        const updated = new Set(prev);
        updated.delete(productId);
        return updated;
      });
    }
  };

  const { mutateAsync: clearCartMutate } = useMutation({
    mutationFn: () => clearCart(user_id),
    onSuccess: () => {
      setCount(0);
      queryClient.invalidateQueries({ queryKey: ["cart", user_id] });
      toast.success("Cart cleared successfully");
    },
    onError: () => {
      toast.error("Failed to clear cart");
    },
  });

  const handleClearCart = async () => {
    await clearCartMutate();
  };

  const handleComplementaryAddToCart = async (product: IProductData) => {
    try {
      let newQuantity = 1;
      const item =
        cartdata &&
        cartdata.cart &&
        cartdata?.cart.find((i) => i._id === product._id);
      if (item) newQuantity = item.qty + 1;

      await addToCart(product, newQuantity, user_id);
      setCount((prev) => prev + 1);
      toast.success(`${product.name} added to cart`);
      queryClient.invalidateQueries({ queryKey: ["cart", user_id] });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product to cart");
    }
  };

  if (cartLoading) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-blue-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartdata && cartdata.cart && cartdata?.cart.length === 0) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center">
        <div className="text-center max-w-md pb-5 min-h-1/3">
          <div className="bg-blue-50 p-6 rounded-full w-64 h-64 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={128} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-blue-600">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Looks like you have not added any products to your cart yet.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            <ArrowLeft size={20} className="mr-2" />
            Continue Shopping
          </Link>
        </div>
        <div className="overflow-hidden">
          <ComplementaryProducts
            products={products}
            title="Product you might to be like"
            onAddToCart={handleComplementaryAddToCart}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container m-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl text-blue-600 font-bold mb-5">
        Your Shopping Cart
      </h1>

      <div className="grid grid-cols-[3fr_1fr] justify-between gap-8 w-full">
        {cartdata && (
          <CartItemBox
            handleClearCart={handleClearCart}
            handleComplementaryAddToCart={handleComplementaryAddToCart}
            handleQuantityChange={handleQuantityChange}
            handleRemoveItem={handleRemoveItem}
            itemsBeingUpdated={itemsBeingUpdated}
            cartdata={cartdata}
            rupeeSymbol={rupeeSymbol}
            products={products}
          />
        )}

        <div className="top-4 sticky h-fit">
          {cartdata && (
            <OrderSummery cartdata={cartdata} rupeeSymbol={rupeeSymbol} />
          )}
        </div>
      </div>
    </div>
  );
}
