'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@components/ui/button';

export default function CancelPage() {
  const router = useRouter();

  const handleGoToCart = () => {
    router.push('/cart');  // Adjust this path if your cart page is different
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">Payment Failed ❌</h1>
        <p className="text-gray-700 mb-6">
          Your transaction was unsuccessful. Please try again later or review your cart.
        </p>
        <Button onClick={handleGoToCart} className="bg-red-600 hover:bg-red-700">
          Go to Cart
        </Button>
      </div>
    </div>
  );
}
