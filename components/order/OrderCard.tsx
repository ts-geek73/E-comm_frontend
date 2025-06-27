import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IOrder } from "@/types/user";
import { Calendar, CreditCard, Download, Eye, Package } from "lucide-react";
import React from "react";
import { formatAmount, formatDate, getStatusColor } from "../Functions/product";
import { triggerDownload } from "../Functions/cart-address";

export const OrderCard: React.FC<{
    order: IOrder;
    titlePrefix?: string;
    onViewDetails?: (order: IOrder) => void;
    onCancelOrder?: (order: IOrder) => void;
    onReturnOrder?: (order: IOrder) => void;
    url?: string
    showItems?: boolean;
}> = ({
    order,
    titlePrefix = "Order",
    onViewDetails,
    onCancelOrder,
    onReturnOrder,
    url,
    showItems = false,
}) => {

        return (
            <div className="grid grid-cols-[2fr_1fr] gap-4 mb-6">
                <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {titlePrefix} #{order._id.slice(-8)}
                        </h3>
                        <Badge variant="secondary" className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Package className="w-4 h-4" />
                            <span>
                                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4" />
                            <span className="font-medium">Rs. {formatAmount(order.amount)}</span>
                        </div>
                    </div>

                    {showItems && (
                        <div className="mt-4 grid">
                            <ol className="grid grid-cols-1 text-sm text-gray-700 list-disc pl-5">
                                {order.items.map((item) => (
                                    <li key={item._id}>{item.product?.name ?? "Unnamed product"}</li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-3 min-w-[180px] justify-end">
                    {onViewDetails && (
                        <Button
                            variant="outline"
                            onClick={() => onViewDetails(order)}
                            className="flex items-center space-x-2"
                        >
                            <Eye className="w-4 h-4" />
                            <span>View Details </span>
                        </Button>
                    )}

                    {order.status == "pending" && onCancelOrder && (
                        <Button
                            variant="destructive"
                            onClick={() => onCancelOrder(order)}
                            className="flex items-center space-x-2 bg-red-600 text-white hover:bg-red-700"
                        >
                            Cancel
                        </Button>
                    )}

                    {order.status == "complete" && onReturnOrder && (
                        <Button
                            onClick={() => onReturnOrder(order)}
                            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600"
                        >
                            Return
                        </Button>
                    )}


                    {url && (
                        <Button
                            onClick={() => triggerDownload(url, 'invoice.pdf')}

                            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                        >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                        </Button>
                        // </a>

                    )}
                </div>
            </div>
        );
    };