'use client'

import ConfirmDelete from "@/components/Header/ConfirmDelete";
import { addToCart, clearCart, fetchcart, getLocalCart, removeFromCart } from "@/components/function";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ICartresponce } from "@/types/product";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, ShoppingBag, Trash2, Loader2, Plus, Minus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CartPage() {
  const [cartdata, setCartdata] = useState<ICartresponce | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [itemsBeingUpdated, setItemsBeingUpdated] = useState<Set<string>>(new Set());
  const { user } = useUser();
  const user_id = user ? user.id : "";
  const rupeeSymbol = "Rs.";

  const loadCart = useCallback(async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleQuantityChange = async (productId: string, change: number) => {
    const item = cartdata?.cart.find((item) => item._id === productId);
    if (!item) return;

    const newQuantity = item.qty + change;
    if (newQuantity < 1) return;

    // Set the item as being updated
    setItemsBeingUpdated(prev => {
      const updated = new Set(prev);
      updated.add(productId);
      return updated;
    });

    try {
      await addToCart(item, newQuantity, user_id);
      loadCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    } finally {
      // Remove the item from being updated
      setItemsBeingUpdated(prev => {
        const updated = new Set(prev);
        updated.delete(productId);
        return updated;
      });
    }
  };

  const handleRemoveItem = async (productId: string) => {
    // Set the item as being updated
    setItemsBeingUpdated(prev => {
      const updated = new Set(prev);
      updated.add(productId);
      return updated;
    });

    try {
      await removeFromCart(productId, user_id);
      loadCart();
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    } finally {
      // Remove the item from being updated
      setItemsBeingUpdated(prev => {
        const updated = new Set(prev);
        updated.delete(productId);
        return updated;
      });
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart(user_id);
      loadCart();
      toast.success("Cart cleared successfully");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  };

  const handleCheckout = () => {
    // Redirect to checkout page
    window.location.href = "/checkout";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-blue-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartdata?.cart.length === 0) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-blue-50 p-6 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={64} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-blue-600">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link href="/products" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg">
            <ArrowLeft size={20} className="mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl text-blue-600 font-bold mb-5">Your Shopping Cart</h1>

      <div className="flex flex-col-reverse lg:flex-row gap-8">

        {/* Cart Items List */}
        <div className="lg:w-2/3">
          <Card className="border-blue-100 shadow-lg">
            <CardHeader className="bg-blue-50 rounded-t-lg border-b border-blue-100 flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-xl text-blue-600">Cart Items</CardTitle>
                <CardDescription>
                  {cartdata?.totalItems} {cartdata?.totalItems === 1 ? 'item' : 'items'} in your shopping bag
                </CardDescription>
              </div>
              
              <ConfirmDelete
                title="Clear Cart"
                description="Are you sure you want to clear your cart? This action cannot be undone."
                onConfirm={handleClearCart}
                trigger={
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-300"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Clear Cart
                  </Button>
                }
              />
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-blue-100">
                {cartdata?.cart.map((item) => (
                  <div key={item._id} className="p-4 md:p-6 flex flex-col md:flex-row group hover:bg-blue-50 transition-colors duration-200">
                    <div className="md:w-24 h-24 relative mb-4 md:mb-0 bg-white rounded-md overflow-hidden border border-blue-100">
                      <Image
                        src={item.image.url || "/images/no-product.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="md:ml-6 flex-grow">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                        <div>
                          <h3 className="text-lg font-medium text-blue-800">{item.name}</h3>
                          {item.notes && (
                            <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
                          )}
                        </div>
                        <p className="text-lg font-semibold text-blue-600 mt-2 md:mt-0">
                          {rupeeSymbol} {item.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-blue-200 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => handleQuantityChange(item._id, -1)}
                            className="w-9 h-9 flex items-center justify-center text-blue-600 hover:bg-blue-50 disabled:opacity-50 transition-colors"
                            disabled={item.qty <= 1 || itemsBeingUpdated.has(item._id)}
                          >
                            <Minus size={16} />
                          </button>
                          <div className="w-12 text-center font-medium">
                            {itemsBeingUpdated.has(item._id) ? (
                              <Loader2 size={16} className="animate-spin mx-auto text-blue-600" />
                            ) : (
                              item.qty
                            )}
                          </div>
                          <button
                            onClick={() => handleQuantityChange(item._id, 1)}
                            className="w-9 h-9 flex items-center justify-center text-blue-600 hover:bg-blue-50 disabled:opacity-50 transition-colors"
                            disabled={itemsBeingUpdated.has(item._id)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="flex items-center text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                          disabled={itemsBeingUpdated.has(item._id)}
                        >
                          {itemsBeingUpdated.has(item._id) ? (
                            <Loader2 size={18} className="animate-spin mr-1" />
                          ) : (
                            <Trash2 size={18} className="mr-1" />
                          )}
                          <span className="text-sm">Remove</span>
                        </button>
                      </div>
                      
                      <div className="mt-3 text-sm text-gray-500">
                        Subtotal: <span className="font-medium text-blue-700">{rupeeSymbol} {(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="bg-blue-50 border-t border-blue-100 p-4">
              <div className="w-full flex justify-between items-center">
                <span className="text-blue-700 font-medium">Total: {rupeeSymbol} {cartdata?.totalPrice.toFixed(2)}</span>
                <Link
                  href="/products"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Continue Shopping
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>

                {/* Order Summary - Now on the left */}
        <div className="lg:w-1/3">
          <div className="sticky top-8">
            <Card className="border-blue-100 shadow-md">
              <CardHeader className="bg-blue-50 rounded-t-lg border-b border-blue-100">
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <ShoppingBag className="h-5 w-5" />
                  Order Summary
                </CardTitle>
                <CardDescription>Review your items before checkout</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cartdata?.totalItems} {cartdata?.totalItems === 1 ? 'item' : 'items'})</span>
                    <span className="font-medium">{rupeeSymbol} {cartdata?.totalPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="italic">Calculated at checkout</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 mt-2"></div>
                  
                  <div className="flex items-center justify-between font-medium text-blue-700">
                    <span>Total</span>
                    <span className="text-xl">{rupeeSymbol} {cartdata?.totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <p className="text-gray-500 text-xs">Tax included where applicable</p>
                </div>
                
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
                  onClick={handleCheckout}
                >
                  <ShoppingBag size={18} className="mr-2" />
                  Proceed to Checkout
                </Button>
                
                <div className="text-center">
                  <Link
                    href="/products"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline text-sm"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    Continue Shopping
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}