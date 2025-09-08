import { ICArtProductPayLoad } from "@types";
import { AlertTriangle, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

// PromoCode Component
interface PromoCodeProps {
  appliedCodes: string[];
  onApplyPromo: (code: string) => Promise<void>;
  onRemovePromo: (code: string) => Promise<void>;
  isApplying: boolean;
  invalidCodes: { code: string; reason: string }[];
  showInvalid: boolean;
  onHideInvalid: () => void;
}

const PromoCodeComp: React.FC<PromoCodeProps> = ({
  appliedCodes,
  onApplyPromo,
  onRemovePromo,
  isApplying,
  invalidCodes,
  showInvalid,
  onHideInvalid,
}) => {
  const [promoInput, setPromoInput] = useState("");

  const handleApply = async () => {
    const trimmedCode = promoInput.trim().toUpperCase();
    if (!trimmedCode) {
      toast.warn("Please enter a promo code");
      return;
    }
    if (appliedCodes.includes(trimmedCode)) {
      toast.warn("Promo code already applied");
      return;
    }

    await onApplyPromo(trimmedCode);
    setPromoInput("");
  };

  return (
    <div className="space-y-3 pt-2 border-t border-gray-200">
      <h4 className="font-medium text-gray-700">Promo Codes</h4>

      <div className="flex gap-2">
        <Input
          placeholder="Enter promo code"
          value={promoInput}
          onChange={(e) => setPromoInput(e.target.value)}
          className="border-blue-200 focus:border-blue-500"
          disabled={isApplying}
          onKeyPress={(e) => e.key === "Enter" && handleApply()}
        />
        <Button
          onClick={handleApply}
          disabled={isApplying || !promoInput.trim()}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          {isApplying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Applying...
            </>
          ) : (
            "Apply"
          )}
        </Button>
      </div>

      {appliedCodes.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {appliedCodes.map((code) => (
            <span
              key={code}
              className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full flex items-center"
            >
              {code}
              <X
                className="ml-2 h-3 w-3 cursor-pointer hover:text-green-900"
                onClick={() => onRemovePromo(code)}
              />
            </span>
          ))}
        </div>
      )}

      {showInvalid && invalidCodes.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 mt-2 relative">
          <div className="flex justify-between items-start">
            <div className="space-y-1 text-sm">
              <p className="font-medium flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Invalid Promo Codes:
              </p>
              <ul className="list-disc ml-5 space-y-1">
                {invalidCodes.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.code}</strong> - {item.reason}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={onHideInvalid}
              className="text-red-500 hover:text-red-700 ml-4 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const renderCartItem = (
  item: ICArtProductPayLoad,
  rupeeSymbol: string,
  isOutOfStock = false
) => (
  <div
    key={item._id}
    className={`flex items-center justify-between border-b border-gray-100 pb-3 ${
      isOutOfStock ? "opacity-75" : ""
    }`}
  >
    <div className="flex items-center space-x-4">
      <div
        className={`relative h-16 w-16 overflow-hidden rounded-md border ${
          isOutOfStock ? "border-red-200 bg-red-50" : "border-gray-200"
        }`}
      >
        <Image
          src={item.image.url || "/placeholder.svg"}
          alt={item.name}
          fill
          className={`object-cover ${isOutOfStock ? "grayscale" : ""}`}
        />
      </div>
      <div>
        <p
          className={`font-medium text-sm ${isOutOfStock ? "text-gray-500" : ""}`}
        >
          {item.name}
        </p>
        <p className="text-xs text-gray-500">Qty: {item.qty}</p>
        <p className="text-xs text-gray-500 font-medium">
          {rupeeSymbol}
          {item.price.toFixed(2)}
        </p>
        {isOutOfStock && (
          <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded mt-1">
            Out of Stock
          </span>
        )}
      </div>
    </div>
    <div className="text-right">
      <p
        className={`font-medium ${isOutOfStock ? "text-red-400 line-through" : "text-blue-500"}`}
      >
        {rupeeSymbol}
        {(item.price * item.qty).toFixed(2)}
      </p>
    </div>
  </div>
);
export default PromoCodeComp;
