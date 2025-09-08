"use client";

import { ICArtProductPayLoad } from "@types";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";

const CartItemCard: React.FC<{
  item: ICArtProductPayLoad;
  itemsBeingUpdated: Set<string>;
  handleRemoveItem: (productId: string) => void;
  handleQuantityChange: (productId: string, change: number) => void;
  rupeeSymbol?: string;
}> = ({
  item,
  handleQuantityChange,
  handleRemoveItem,
  itemsBeingUpdated,
  rupeeSymbol = "Rs.",
}) => {
  return (
    <div className="p-4 md:p-6 flex flex-col md:flex-row group hover:bg-blue-50 transition-colors duration-200">
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
                <Loader2
                  size={16}
                  className="animate-spin mx-auto text-blue-600"
                />
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
          Subtotal:{" "}
          <span className="font-medium text-blue-700">
            {rupeeSymbol} {(item.price * item.qty).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
