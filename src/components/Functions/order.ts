import apiServer from "@/lib/axios";
import { IInvoice, InvoiceFilters, IOrder, OrderFilters } from "@types";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const fetchInvoices = async (page: number, filters: InvoiceFilters, userEmail: string): Promise<{ invoices: IInvoice[]; TotalCount: number }> => {
    if (!userEmail) return { invoices: [], TotalCount: 0 };

    try {
        const queryParams = new URLSearchParams({
            email: userEmail,
            invoices: 'true',
            page: page.toString(),
            limit: filters.limit.toString(),
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,

            ...(filters.search && { search: filters.search }),
            ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
            ...(filters.dateTo && { dateTo: filters.dateTo }),
        });

        const response = await apiServer.get(`/order/invoice?${queryParams.toString()}`);
        const data = response.data;

        if (data.success) {
            return { "invoices": data.data.items, "TotalCount": data.data.totalCount }
        } else {
            return { invoices: [], TotalCount: 0 };
        }
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return { invoices: [], TotalCount: 0 };
    }
};

export const fetchOrders = async (
    page: number,
    filters: OrderFilters,
    userEmail: string
): Promise<{ orders: IOrder[]; TotalCount: number }> => {
    if (!userEmail) return { orders: [], TotalCount: 0 };

    try {
        const queryParams = new URLSearchParams({
            email: userEmail,
            page: page.toString(),
            limit: filters.limit.toString(),
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
            ...(filters.status !== 'all' && { status: filters.status }),
            ...(filters.search && { search: filters.search }),
            ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
            ...(filters.dateTo && { dateTo: filters.dateTo }),
        });

        const response = await apiServer.get(`/order/invoice?${queryParams.toString()}`);
        const data = response.data;

        if (data.success) {
            return {
                orders: data.data.items,
                TotalCount: data.data.totalCount,
            };
        } else {
            return { orders: [], TotalCount: 0 }; // Return fallback if !success
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        return { orders: [], TotalCount: 0 };
    }
};

export const updateOrderStatus = async (
    endpoint: string,
    order: IOrder,
    userId: string,
    userEmail: string
): Promise<{ success: boolean; message: string }> => {
    if (!userId || !userEmail) return { success: false, message: "Missing user details" };

    try {
        const response = await apiServer.put(`/order/cancel-return`, {
            order,
            user_id: userId,
            status: endpoint,
            userEmail,
        });

        console.log("🚀 ~ response:", response)
        if (response.data.success) {
            toast.success(response.data.message)
            return { success: true, message: response.data.message || "Order updated successfully" };
        } else {
            return { success: false, message: response.data.message };
        }
    } catch (error: unknown) {
        console.log("🚀 ~ error:", error)
        if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message);
            return { success: false, message: error.response?.data?.message || "Request failed" };
        }else{
            return { success: false, message: "Request failed" };
        }
    }
};


