"use client";

import type React from "react";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { IProductData, ProductEntry } from "@types";
import { Plus } from "lucide-react";
import { Dispatch, memo, SetStateAction, useCallback, useState } from "react";
import ProductRow from "./ProcductStockRow";

const ProductStockCard: React.FC<{
  productEntries: ProductEntry[];
  isEditable: boolean;
  setProductList: Dispatch<SetStateAction<ProductEntry[]>>;
  onUpdate?: (productLIst: ProductEntry[]) => void;
  products: IProductData[];
}> = ({ productEntries, setProductList, isEditable, products }) => {
  const [error, setError] = useState<string | null>();

  const handleProductChange = (
    index: number,
    field: keyof ProductEntry,
    value: string | number
  ) => {
    const updated = [...productEntries];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setError(null);
    setProductList(updated);
  };

  const removeProductEntry = (index: number) => {
    if (productEntries.length > 1) {
      const updated = productEntries.filter((_, i) => i !== index);

      setProductList(updated);
    }
  };

  const addProductEntry = useCallback(() => {
    const inValid = productEntries.filter(
      (pe) => pe.product_id === "" || pe.quantity < 1
    );
    console.log(
      "🚀 ~ addProductEntry ~ productEntries:",
      productEntries,
      inValid
    );
    if (inValid.length !== 0) {
      setError("firtst fill the Required fields");
    } else {
      setProductList([...productEntries, { product_id: "", quantity: 0 }]);
    }
  }, [productEntries]);

  const canRemoveEntry: boolean = productEntries.length > 1 && isEditable;

  return (
    <Card>
      <CardHeader className="flex py-3 flex-row items-center justify-between">
        <CardTitle className="text-lg">Products</CardTitle>
        {isEditable && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addProductEntry}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        )}
      </CardHeader>
      <CardContent className="">
        {error && <p className="text-red-500 text-sm p-0 ">{error}</p>}

        {productEntries.map((entry, index) => (
          <ProductRow
            key={index}
            entry={entry}
            index={index}
            products={products}
            onProductChange={handleProductChange}
            onRemove={removeProductEntry}
            canRemove={canRemoveEntry}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default memo(ProductStockCard);
