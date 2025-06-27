'use client'

import { addToCart, clearCart, fetchcart, getLocalCart, removeFromCart } from "@/components/Functions/cart-address";
import ConfirmDelete from "@/components/Header/ConfirmDelete";
import CartItemCard from "@/components/order/CartItemCard";
import OrderSummery from "@/components/order/OrderSummery";
import ComplementaryProducts from "@/components/Product/complementyProducts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useProductFetch } from "@/hooks";
import { ICartresponce, IProductData } from "@/types/product";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CartPage() {
  const [cartdata, setCartdata] = useState<ICartresponce | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [itemsBeingUpdated, setItemsBeingUpdated] = useState<Set<string>>(new Set());
  const { user } = useUser();
  const user_id = user ? user.id : "";
  const rupeeSymbol = "Rs.";
  const { products } = useProductFetch(1, 5);

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
    if (user === undefined) return;

    user?.id ? loadCart() : loadCart();
  }, [user]);

  const handleQuantityChange = async (productId: string, change: number) => {
    const item = cartdata?.cart.find((item) => item._id === productId);
    if (!item) return;

    const newQuantity = item.qty + change;
    if (newQuantity < 1) return;

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
      setItemsBeingUpdated(prev => {
        const updated = new Set(prev);
        updated.delete(productId);
        return updated;
      });
    }
  };

  const handleRemoveItem = async (productId: string) => {
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

  const handleComplementaryAddToCart = async (product: IProductData) => {
    try {
      let newQuantity: number = 1;
      const item = cartdata?.cart.find((item) => item._id === product._id);
      if (item) {
        newQuantity = item.qty + 1;
      };

      if (newQuantity < 1) return;
      const response = await addToCart(product, newQuantity, user_id)
      if (response) {
        toast.success(`${product.name} added to cart`)
        loadCart()
      }
    } catch (error) {
      console.error("Error adding complementary product to cart:", error)
      toast.error("Failed to add product to cart")
    }
  }

  if (!cartdata && isLoading) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-blue-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartdata && cartdata?.cart.length === 0) {
    return (
      <div className="container mx-auto p-6 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-blue-50 p-6 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={64} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-blue-600">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you have not added any products to your cart yet.</p>
          <Link href="/products" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg">
            <ArrowLeft size={20} className="mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container m-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl text-blue-600 font-bold mb-5">Your Shopping Cart</h1>

      <div className="grid grid-cols-[3fr_1fr] justify-between gap-8 w-full overflow-hidden">
        <div className="grid gap-5">
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
                {cartdata?.cart.map((item, index) => (
                  <CartItemCard
                    key={item._id + index}
                    item={item}
                    itemsBeingUpdated={itemsBeingUpdated}
                    handleQuantityChange={handleQuantityChange}
                    handleRemoveItem={handleRemoveItem}
                  />
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

          <div className="overflow-hidden">
            <ComplementaryProducts
              products={products}
              title="Product you might to be like"
              onAddToCart={handleComplementaryAddToCart}
            />
          </div>
        </div>

        <div className="top-4 sticky h-fit">
          {cartdata && (
            <OrderSummery
              cartdata={cartdata}
              rupeeSymbol={rupeeSymbol}
            />
          )}
        </div>
      </div>
    </div>
  );
}