'use client';

import { useEffect, useState, Suspense } from 'react'; // Import Suspense
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiServer from '@/lib/axios';

interface OrderInfo {
  email: string;
  amount: number;
  status: string;
}

// Create a separate component that uses useSearchParams
function OrderDetailsFetcher() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('order');
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  console.log(redirectUrl);
  useEffect(() => {
    if (!orderId) {
      setError('Missing order ID');
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const {data } = await apiServer.get(`/order/invoice?orderId=${orderId}`);
        
        setRedirectUrl(data.data.receiptUrl);
        setOrder(data.data.order);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleViewInvoice = () => {
    if (redirectUrl) {
      console.log(redirectUrl);
      
      window.open(redirectUrl, '_blank');
    }
  };

  const handleShopAgain = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-extrabold text-green-600 mb-4">Payment Successful 🎉</h1>
        <p className="text-gray-700 mb-6">Thank you for your purchase! Your order is confirmed.</p>

        {order && (
          <div className="mb-6 space-y-4 text-gray-800">
            <div>
              <strong>Order No:</strong> {orderId}
            </div>
            <div>
              <strong>Email:</strong> {order.email}
            </div>
            <div>
              <strong>Amount Paid:</strong> ₹{(order.amount).toFixed(2)}
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Button onClick={handleViewInvoice} className="bg-green-600 hover:bg-green-700">
            View Invoice
          </Button>
          <Button onClick={handleShopAgain} variant="outline">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}

// The main SuccessPage component that renders the Suspense boundary
export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
      </div>
    }>
      <OrderDetailsFetcher />
    </Suspense>
  );
}