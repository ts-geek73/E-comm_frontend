import { Button } from "@components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@components/ui/card";
import { ICartresponce } from "@types";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import React from "react";
import "react-toastify/dist/ReactToastify.css";

const OrderSummery: React.FC<{
  cartdata: ICartresponce;
  rupeeSymbol?: string;
}> = ({ cartdata, rupeeSymbol = "Rs." }) => {
  const TotalItemPrice: number = cartdata.cart
    ? cartdata.cart.reduce((sum, acc) => sum + acc.price * acc.qty, 0)
    : 0;
  console.log("🚀 ~ cartdata:", cartdata);

  return (
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
            <span className="text-gray-600">
              Subtotal ({cartdata.cart?.length} items)
            </span>
            <span className="font-medium">
              {rupeeSymbol} {TotalItemPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="italic">Calculated at checkout</span>
          </div>

          <div className="border-t border-gray-200 pt-3 mt-2"></div>

          <div className="flex items-center justify-between font-medium text-blue-700">
            <span>Total</span>
            <span className="text-xl">
              {rupeeSymbol} {TotalItemPrice.toFixed(2)}
            </span>
          </div>

          <p className="text-gray-500 text-xs">Tax included where applicable</p>
        </div>

        <Link href={"/checkout"}>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 rounded-lg transition-colors shadow-md hover:shadow-lg">
            <ShoppingBag size={18} className="mr-2" />
            Proceed to Checkout
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default OrderSummery;
