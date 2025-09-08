"use client";

import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import {
  defultBasicForm,
  IBasicFormType,
  IStockEntry,
  ProductEntry,
  StockDetailsModalProps,
} from "@types";

import { memo, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BasicInfoCard, ProductStockCard } from "..";

const StockDetailsModal: React.FC<StockDetailsModalProps> = ({
  open,
  onOpenChange,
  stockEntry,
  products,
  onSave,
  email,
}) => {
  const [formData, setFormData] = useState<IBasicFormType>(defultBasicForm);
  const [productEntries, setProductEntries] = useState<ProductEntry[]>([]);
  const isEditing = !!stockEntry;

  useEffect(() => {
    if (stockEntry) {
      setFormData({
        stock_name: stockEntry.stock_name,
        description: stockEntry.description || "",
        added_by: stockEntry.added_by,
      });
      setProductEntries(stockEntry.products);
    } else {
      setFormData({ ...defultBasicForm, added_by: email });
      setProductEntries([{ product_id: "", quantity: 0 }]);
    }
  }, [open]);

  const handleFormDataChange = (newFormData: IBasicFormType) => {
    console.log("🚀 ~ handleFormDataChange ~ newFormData:", newFormData);
    setFormData(newFormData);
  };
  const handleSave = () => {
    const validProductEntries = productEntries.filter(
      (entry) => entry.product_id !== "" && entry.quantity !== 0
    );
    console.log("🚀 ~ handleSave ~ validProductEntries:", validProductEntries);
    console.log("🚀 ~ handleSave ~ formData:", formData);

    if (
      !formData.stock_name ||
      !formData.description ||
      validProductEntries.length === 0
    ) {
      toast.error(
        "Please fill in all required fields and add at least one product."
      );
      return;
    }

    const entry: IStockEntry = {
      _id: stockEntry?._id || "",
      stock_name: formData.stock_name,
      description: formData.description,
      date: stockEntry?.date || new Date(),
      products: validProductEntries.map((p) => ({
        ...p,
        quantity: Math.abs(p.quantity),
      })),
      added_by: formData.added_by,
    };

    onSave(entry);
  };

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="min-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Stock Entry Details" : "New Stock Entry"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "View and edit stock entry information"
                : "Create a new stock entry to track inventory changes"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <BasicInfoCard formData={formData} onSave={handleFormDataChange} />
            <ProductStockCard
              productEntries={productEntries}
              products={products}
              isEditable={!isEditing}
              onUpdate={(productList) =>
                console.log("ProductList", productList)
              }
              setProductList={setProductEntries}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? "Update Entry" : "Create Entry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default memo(StockDetailsModal);
