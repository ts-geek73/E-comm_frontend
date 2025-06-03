'use client';
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
import apiServer from '@/lib/axios';
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
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const [totalOrderCount, setOrderTotalCount] = useState<number>(0)
  const [totalInvoiceTotalCount, setInvoiceTotalCount] = useState<number>(0)
  const [orderFilters, setOrderFilters] = useState<OrderFilters>(defaultOrderFilters);
  const [invoiceFilters, setInvoiceFilters] = useState<InvoiceFilters>(defaultInvoiceFilters);


  useEffect(() => {
    if (userEmail) {
      if (activeTab === 'orders') {
        fetchOrders(1, orderFilters);
      } else {
        fetchInvoices(1, invoiceFilters);
      }
    }
  }, [userEmail, activeTab]);

  // Handle order page change
  useEffect(() => {
    if (userEmail && activeTab === 'orders') {
      fetchOrders(currentOrderPage, orderFilters);
    }
  }, [currentOrderPage]);

  // Handle invoice page change
  useEffect(() => {
    if (userEmail && activeTab === 'invoices') {
      fetchInvoices(currentInvoicePage, invoiceFilters);
    }
  }, [currentInvoicePage]);

  const fetchOrders = async (page: number = currentOrderPage, filters = orderFilters) => {
    if (!userEmail) return;

    try {
      setLoading(true);
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

      // console.log(queryParams);


      const response = await apiServer.get(`/order/invoice?${queryParams.toString()}`);
      const data = response.data;
      // console.log("fetchOrders:", data);


      if (data.success) {
        setOrders(data.data.items);
        setOrderTotalCount(data.data.totalCount);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch invoices separately
  const fetchInvoices = async (page: number = currentInvoicePage, filters = invoiceFilters) => {
    if (!userEmail) return;

    try {
      setLoading(true);
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

      // console.log("queryParams", queryParams);


      const response = await apiServer.get(`/order/invoice?${queryParams.toString()}`);
      const data = response.data;
      // console.log("fetchInvoices:", data);


      if (data.success) {
        setInvoices(data.data.items);
        setInvoiceTotalCount(data.data.totalCount);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderFilterChange = (key: string, value: string) => {
    setOrderFilters((prev) => ({ ...prev, [key]: value }));
    fetchOrders(1, { ...orderFilters, [key]: value }); // Reset to page 1
    setOrderPage(1);
  };
  const handleInvoiceFilterChange = (key: string, value: string) => {
    setInvoiceFilters((prev) => ({ ...prev, [key]: value }));
    fetchInvoices(1, { ...invoiceFilters, [key]: value }); // Reset to page 1
    setInvoicePage(1);
  };

  const clearOrderFilters = () => {
    setOrderFilters(defaultOrderFilters);
    fetchOrders(1, defaultOrderFilters);
    setOrderPage(1);
  };

  const clearInvoiceFilters = () => {
    setInvoiceFilters(defaultInvoiceFilters);
    fetchInvoices(1, defaultInvoiceFilters);
    setInvoicePage(1);
  };

  const openOrderModal = (order: IOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
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