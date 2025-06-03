import { Card, CardContent } from '@/components/ui/card';
import { IOrder } from '@/types/user';
import { Package } from 'lucide-react';
import React from 'react';
import { OrderCard } from './OrderCard';

const OrdersTab:
    React.FC<{ orders: IOrder[]; onViewOrder: (order: IOrder) => void; }> =
    ({ orders, onViewOrder }) => {

        return (
            <div className="space-y-4">
                {orders.map((order) => (
                    <Card key={order._id} className="shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">

                            <OrderCard
                                order={order}
                                titlePrefix="Order"
                                onViewDetails={(order) => onViewOrder(order)}
                                showItems={true}
                            />

                        </CardContent>
                    </Card>
                ))}

                {orders.length === 0 && (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                            <p className="text-gray-500">{`You haven't placed any orders yet.`}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        );
    };

export default OrdersTab;