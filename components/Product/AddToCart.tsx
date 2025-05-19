import { IProductData } from "@/types/product";
import { useUser } from "@clerk/nextjs";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addToCart, getLocalCart } from "../function";

export default function AddToCartSection({ product }: { product: IProductData }) {
  const [quantity, setQuantity] = useState<number>(1);
  const { user } = useUser()
  const user_id = user ? user?.id : "";

  useEffect(() => {
    const cart = getLocalCart();
    const qtnty = cart.products.find(
      (item) => item.product._id.toString() === product._id.toString()
    );
    setQuantity(qtnty?.qty ?? 1);
  }, [product._id]);
  
  

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => {
      const newQty = prev + change;
      if (newQty < 0) return 0;
      return newQty;
    });
  };

  const handleAddToCart = async () => {
    console.log("Adding to cart:", { product_id: product._id, quantity });
    try {
      const responce = await addToCart(product, quantity, user_id)

      if (responce) {
        toast.success(`Product ${product.name} added in Cart`)
      }
    } catch (error) {
      console.log("CArt added Error: ", error);

    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center border border-gray-300 rounded-lg">
        <button
          onClick={() => handleQuantityChange(-1)}
          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg"
          disabled={quantity <= 1}
        >
          -
        </button>
        <span className="w-16 text-center flex items-center justify-center border-x border-gray-300">
          {quantity}
        </span>
        <button
          onClick={() => handleQuantityChange(1)}
          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg flex items-center justify-center transition-colors"
      >
        <ShoppingCart size={20} className="mr-2" />
        Add to Cart
      </button>
    </div>
  );
}
