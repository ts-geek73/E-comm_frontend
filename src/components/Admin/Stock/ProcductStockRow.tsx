import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { IProductData, ProductEntry } from "@types";
import { Trash2 } from "lucide-react";
import { memo, useCallback } from "react";

const ProductRow: React.FC<{
  entry: ProductEntry;
  index: number;
  products: IProductData[];
  onProductChange: (
    index: number,
    field: keyof ProductEntry,
    value: string | number
  ) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}> = ({ entry, index, products, onProductChange, onRemove, canRemove }) => {
  const handleQuantityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(e.target.value) || 1;
      onProductChange(index, "quantity", value);
    },
    [index, onProductChange]
  );

  const handleProductSelect = useCallback(
    (productId: string) => {
      onProductChange(index, "product_id", productId);
    },
    [index, onProductChange]
  );

  const handleRemoveClick = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  return (
    <div className="grid grid-cols-[2fr_1fr_0.1fr] items-center gap-4 p-4 border rounded-lg">
      <div className="space-y-2">
        <Label htmlFor={`product-select-${index}`}>Product</Label>
        <Select value={entry.product_id} onValueChange={handleProductSelect}>
          <SelectTrigger id={`product-select-${index}`} className="w-full">
            <SelectValue placeholder="Select product..." />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product._id} value={product._id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-32 space-y-2">
        <Label htmlFor={`quantity-${index}`}>Quantity</Label>
        <Input
          id={`quantity-${index}`}
          type="number"
          required
          value={entry.quantity}
          onChange={handleQuantityChange}
          min="1"
        />
      </div>

      {canRemove && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleRemoveClick}
          className="text-destructive space-y-2 hover:text-destructive bg-transparent"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default memo(ProductRow);
