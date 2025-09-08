import ConfirmDelete from "@components/Header/ConfirmDelete";
import CartItemCard from "@components/order/CartItemCard";
import ComplementaryProducts from "@components/Product/Complementry Product/complementyProducts";
import { Button } from "@components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { ICartItemComp } from "@types";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";

const CartItemBox: React.FC<ICartItemComp> = ({
  cartdata,
  rupeeSymbol,
  products,
  handleComplementaryAddToCart,
  handleClearCart,
  handleQuantityChange,
  itemsBeingUpdated,
  handleRemoveItem,
}) => {
  return (
    <div className="grid gap-5">
      <Card className="border-blue-100 shadow-lg">
        <CardHeader className="bg-blue-50 rounded-t-lg border-b border-blue-100 flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-xl text-blue-600">Cart Items</CardTitle>
            <CardDescription>
              {cartdata?.totalItems}{" "}
              {cartdata?.totalItems === 1 ? "item" : "items"} in your shopping
              bag
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
            {cartdata?.cart &&
              cartdata?.cart.map((item, index) => (
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
            <span className="text-blue-700 font-medium">
              Total: {rupeeSymbol} {cartdata?.totalPrice.toFixed(2)}
            </span>
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
  );
};

export default CartItemBox;
