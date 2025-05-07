'use client'

import { addToCart, fetchcart, getLocalCart, removeFromCart } from "@/components/function";
import { ICartresponce } from "@/types/product";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CartPage() {
  const [cartdata, setCartdata] = useState<ICartresponce>({ cart: [], totalItems: 0, totalPrice: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useUser();
  const user_id = user ? user.id : "";

  useEffect(() => {
    loadCart();
  }, [user_id]);

  const loadCart = async() => {
    setIsLoading(true);
    try {
      // const cartData = getLocalCart();

      if(user?.id){
        const cartData = await fetchcart(user?.id)
        console.log("cart data", cartData);
        
        setCartdata(cartData);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      toast.error("Failed to load your cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = async (productId: string, change: number) => {
    const item = cartdata.cart.find((item) => item._id === productId);
    if (!item) return;

    const newQuantity = item.qty + change;
    if (newQuantity < 1) return;

    try {
      await addToCart(item._id, newQuantity, user_id);
      loadCart(); 
      toast.success("Cart updated successfully");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId: string) => {
    const item = cartdata.cart.find((item) => item._id === productId);
    if (!item) return;

    try {
      await removeFromCart(item._id, user_id);
      loadCart();
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartdata.cart.length === 0) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <ShoppingBag size={64} className="mx-auto mb-6 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link href="/products" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Cart Items ({cartdata.totalItems})</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {cartdata.cart.map((item) => (
                <div key={item._id} className="p-4 md:p-6 flex flex-col md:flex-row">
                  <div className="md:w-24 h-24 relative mb-4 md:mb-0">
                    <Image 
                      src={item.image.url || "no-product.jpg"} 
                      alt={item._id}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  
                  <div className="md:ml-6 flex-grow">
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{item.name}</h3>
                        {/* <p className="text-gray-600 text-sm mt-1">Product ID: {item._id}</p> */}
                      </div>
                      <p className="text-lg font-semibold text-blue-600 mt-2 md:mt-0">
                        Rs. {item.price.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item._id, -1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                          disabled={item.qty <= 1}
                        >
                          -
                        </button>
                        <span className="w-12 text-center">{item.qty}</span>
                        <button
                          onClick={() => handleQuantityChange(item._id, 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="flex items-center text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} className="mr-1" />
                        <span className="hidden md:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <Link href="/products" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
              <ArrowLeft size={18} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>Rs. {cartdata.totalPrice.toFixed(2)}</span>
              </div>
              {/* <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>Calculated at checkout</span>
              </div> */}
              <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-blue-600 text-xl">Rs. {cartdata.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              onClick={() => {
                // Handle checkout logic
                toast.info("Proceeding to checkout...");
              }}
            >
              Proceed to Checkout
            </button>
            
            
          </div>
        </div>
      </div>
    </div>
  );
}