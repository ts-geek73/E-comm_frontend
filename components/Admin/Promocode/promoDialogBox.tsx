'use client'
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PromoCode } from '@/types/product';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface PromoCodeDialogProps {
  open: boolean;
  onClose: () => void;
  promo: PromoCode | null;
  setPromo: React.Dispatch<React.SetStateAction<PromoCode | null>>;
  onSave: (promo: PromoCode) => void;
}

const PromoCodeDialog: React.FC<PromoCodeDialogProps> = ({ open, onClose, promo, setPromo, onSave }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!promo?.code) newErrors.code = 'Code is required';
    if (!['flat', 'percentage'].includes(promo?.type ?? '')) newErrors.type = 'Type must be "flat" or "percentage"';
    if (!promo?.amount || promo.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!promo?.expiryDate) newErrors.expiryDate = 'Expiry Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (promo && validate()) {
      onSave(promo);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{promo?._id ? 'Edit Promo Code' : 'Create Promo Code'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Input
              placeholder="Code"
              value={promo?.code || ''}
              onChange={(e) => setPromo((prev) => ({ ...prev!, code: e.target.value.toUpperCase() }))}
            />
            {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
          </div>

          <div>
            <Select
              value={promo?.type || ""}
              onValueChange={(value: "flat" | "percentage") => {
                setPromo((prev) => ({ ...prev!, type: value }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flat">Flat</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
          </div>


          <div>
            <Input
              placeholder="Amount"
              type="number"
              value={promo?.amount || 0}
              onChange={(e) => setPromo((prev) => ({ ...prev!, amount: Number(e.target.value) }))}
            />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
          </div>

          <div>
            <Input
              type="date"
              value={promo?.expiryDate?.split('T')[0] || ''}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setPromo((prev) => ({ ...prev!, expiryDate: e.target.value }))}
            />
            {errors.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>{promo?._id ? 'Update' : 'Create'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromoCodeDialog;