'use client';

import { Loader2 } from 'lucide-react';
import { lazy, Suspense } from 'react';

const CheckoutSuccess = lazy(() => import('./CheckOutSuccessContent'));

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
      </div>
    }>
      <CheckoutSuccess />
    </Suspense>
  );
}
