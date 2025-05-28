'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiServer from '@/lib/axios';

interface Address {
  _id: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  [key: string]: any;
}

interface OrderInfo {
  email: string;
  amount: number;
  status: string;
  billing_address: Address | null;
  shipping_address: Address | null;
  // add any other fields you want to show
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError('Missing order ID');
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const res = await apiServer.get(`/order/invoice/${orderId}`);
        // Assuming res.data has { receiptUrl, order }
        setRedirectUrl(res.data.receiptUrl);
        setOrder(res.data.order); // Make sure backend sends this!
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
      window.open(redirectUrl, '_blank');
    }
  };

  const handleShopAgain = () => {
    router.push('/'); // or wherever your shop/homepage is
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-extrabold text-green-600 mb-4">Payment Successful 🎉</h1>
        <p className="text-gray-700 mb-6">Thank you for your purchase! Your order is confirmed.</p>

        {order && (
          <div className="mb-6 space-y-4 text-gray-800">
            <div>
              <strong>Email:</strong> {order.email}
            </div>
            <div>
              <strong>Amount Paid:</strong> ₹{(order.amount).toFixed(2)}
            </div>
            <div>
              <strong>Status:</strong> <span className="capitalize">{order.status}</span>
            </div>

          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Button onClick={handleViewInvoice} className="bg-green-600 hover:bg-green-700">
            View Invoice
          </Button>
          <Button onClick={handleShopAgain} variant="outline">
            Shop Again
          </Button>
        </div>
      </div>
    </div>
  );
}
