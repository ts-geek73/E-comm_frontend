'use client';
import { fetchInvoices, fetchOrders, updateOrderStatus } from '@/components/Functions/order';
import { InvoiceFiltersComponent } from '@/components/order/InvoiceFilters';
import InvoicesTab from '@/components/order/InvoiceTabs';
import OrderDetailsModal from '@/components/order/OrderDetailsModel';
import { OrderFiltersComponent } from '@/components/order/OrderFilters';
import OrdersTab from '@/components/order/OrderTabs';
import PaginationComp from '@/components/Product/PaginationComp';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { defaultInvoiceFilters, defaultOrderFilters, IInvoice, InvoiceFilters, IOrder, OrderFilters } from '@/types/user';
import { useUser } from '@clerk/nextjs';
import { Filter } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const OrdersInvoicesPage: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'invoices'>('orders');
  const [currentOrderPage, setOrderPage] = useState<number>(1)
  const [currentInvoicePage, setInvoicePage] = useState<number>(1)
  const [itemPerPage] = useState<number>(5)
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useUser();
  const userEmail: string | undefined = user?.primaryEmailAddress?.emailAddress;
  const userId: string | undefined = user?.id;
  const [totalOrderCount, setOrderTotalCount] = useState<number>(0)
  const [totalInvoiceTotalCount, setInvoiceTotalCount] = useState<number>(0)
  const [orderFilters, setOrderFilters] = useState<OrderFilters>(defaultOrderFilters);
  const [invoiceFilters, setInvoiceFilters] = useState<InvoiceFilters>(defaultInvoiceFilters);

  useEffect(() => {
    const loadData = async () => {
      if (!userEmail) return;
      setLoading(true);

      try {
        if (activeTab === 'orders') {
          const result = await fetchOrders(1, orderFilters, userEmail);
          if (result) {
            setOrders(result.orders || []);
            setOrderTotalCount(result.TotalCount || 0);
          }
        } else {
          const result = await fetchInvoices(1, invoiceFilters, userEmail);
          if (result) {
            setInvoices(result.invoices || []);
            setInvoiceTotalCount(result.TotalCount || 0);
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userEmail, activeTab]);

  // Handle order page change
  useEffect(() => {
    const loadOrders = async () => {
      if (!userEmail || activeTab !== 'orders') return;
      const result = await fetchOrders(currentOrderPage, orderFilters, userEmail);
      if (result) {
        setOrders(result.orders || []);
        setOrderTotalCount(result.TotalCount || 0);
      }
    };
    loadOrders();
  }, [currentOrderPage]);

  useEffect(() => {
    const loadInvoices = async () => {
      if (!userEmail || activeTab !== 'invoices') return;
      const result = await fetchInvoices(currentInvoicePage, invoiceFilters, userEmail);
      if (result) {
        setInvoices(result.invoices || []);
        setInvoiceTotalCount(result.TotalCount || 0);
      }
    };
    loadInvoices();
  }, [currentInvoicePage]);



  const handleOrderFilterChange = async (key: string, value: string) => {
    const newFilters = { ...orderFilters, [key]: value };
    setOrderFilters(newFilters);
    setOrderPage(1);
    const result = await fetchOrders(1, newFilters, userEmail ?? '');
    if (result) {
      setOrders(result.orders || []);
      setOrderTotalCount(result.TotalCount || 0);
    }
  };

  const handleInvoiceFilterChange = async (key: string, value: string) => {
    const newFilters = { ...invoiceFilters, [key]: value };
    setInvoiceFilters(newFilters);
    setInvoicePage(1);
    const result = await fetchInvoices(1, newFilters, userEmail ?? '');
    if (result) {
      setInvoices(result.invoices || []);
      setInvoiceTotalCount(result.TotalCount || 0);
    }
  };

  const clearOrderFilters = async () => {
    console.log("🚀 ~ clearOrderFilters ~ clearOrderFilters:")
    setOrderFilters(defaultOrderFilters);
    const result = await fetchOrders(1, defaultOrderFilters, userEmail ?? " ");
    if (result) {
      setOrders(result.orders || []);
      setOrderTotalCount(result.TotalCount || 0);
    }
    setOrderPage(1);
  };

  const clearInvoiceFilters = async () => {
    setInvoiceFilters(defaultInvoiceFilters);
    const result = await fetchInvoices(1, defaultInvoiceFilters, userEmail ?? " ");
    if (result) {
      setInvoices(result.invoices || []);
      setInvoiceTotalCount(result.TotalCount || 0);
    }
    fetchInvoices(1, defaultInvoiceFilters, userEmail ?? " ");
    setInvoicePage(1);
  };

  const openOrderModal = (order: IOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const onCancelOrder = async(order: IOrder) => {
    if (userId && userEmail) {
      await updateOrderStatus("cancel", order, userId, userEmail)
    }
    clearOrderFilters()
  };
  
  const onReturnOrder = async(order: IOrder) => {
    if (userId && userEmail) {
      await updateOrderStatus("return", order, userId, userEmail)
    }
    clearOrderFilters()
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-4 w-32 mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders & Invoices</h1>
          <p className="text-gray-600">Manage your orders and download invoices</p>
        </div>



        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'orders' | 'invoices')}>
          <div className="flex justify-between">

            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
            </TabsList>

            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>


          <TabsContent value="orders" className="mt-6">
            {showFilters &&
              <OrderFiltersComponent
                orderFilters={orderFilters}
                handleOrderFilterChange={handleOrderFilterChange}
                clearOrderFilters={clearOrderFilters}
              />}

            <OrdersTab
              orders={orders}
              onViewOrder={openOrderModal}
              onReturnOrder={onReturnOrder}
              onCancelOrder={onCancelOrder}

            />
            <PaginationComp
              length={totalOrderCount}
              currentPage={currentOrderPage}
              setCurrentPage={setOrderPage}
              itemsPerPage={itemPerPage}
            />
          </TabsContent>

          <TabsContent value="invoices" className="mt-6">
            {showFilters &&
              <InvoiceFiltersComponent
                invoiceFilters={invoiceFilters}
                handleInvoiceFilterChange={handleInvoiceFilterChange}
                clearInvoiceFilters={clearInvoiceFilters}
              />}

            <InvoicesTab invoices={invoices} />
            <PaginationComp
              length={totalInvoiceTotalCount}
              currentPage={currentInvoicePage}
              setCurrentPage={setInvoicePage}
              itemsPerPage={itemPerPage}
            />
          </TabsContent>
        </Tabs>

        <OrderDetailsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          selectedOrder={selectedOrder}
        />
      </div>
    </div>
  );
};

export default OrdersInvoicesPage;