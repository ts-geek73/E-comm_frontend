import React from 'react';
import { IOrder } from '@/types/user';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatAmount, getStatusColor } from '../function';
import OrderItemsList from './OrderList';

const OrderDetailsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  selectedOrder: IOrder | null;
}> = ({ 
  isOpen, 
  onClose, 
  selectedOrder 
}) => {
  if (!selectedOrder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Order Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-900">Order Number:</span>
              <p className="text-gray-600 mt-1">{selectedOrder._id}</p>
            </div>
            <div>
              <span className="font-medium text-gray-900">Status:</span>
              <div className="mt-1">
                <Badge 
                  variant="secondary"
                  className={getStatusColor(selectedOrder.status)}
                >
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
            <OrderItemsList items={selectedOrder.items} />
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
            <span className="text-lg font-bold text-gray-900">
              ${formatAmount(selectedOrder.amount)}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;