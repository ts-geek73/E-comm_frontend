import React from 'react';
import { formatAmount } from '@/components/function';
import { IOrderItem } from '@/types/user';

const OrderItemsList: React.FC<{items: IOrderItem[];}> = ({ items }) => (
  <ul className="divide-y divide-gray-200">
    {items.map((item) => (
      <li key={item._id} className="py-3 flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-900">{item.product?.name || item.name}</p>
          {item.notes && <p className="text-xs text-gray-500 italic">{item.notes}</p>}
        </div>
        <div className="text-sm text-gray-700">
          {item.qty} × Rs{formatAmount(item.product?.price || item.price)} = Rs{((item.qty * (item.product?.price || item.price)) / 100).toFixed(2)}
        </div>
      </li>
    ))}
  </ul>
);

export default OrderItemsList;
