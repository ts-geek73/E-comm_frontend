import { Card, CardContent } from '@/components/ui/card';
import { IInvoice } from '@/types/user';
import { FileText } from 'lucide-react';
import React from 'react';
import { OrderCard } from './OrderCard';

const InvoicesTab: React.FC<{ invoices: IInvoice[] }> = ({ invoices }) => {
  
  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <Card key={invoice._id} className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">

            <OrderCard
              order={invoice.orderId}
              titlePrefix="Invoice"
              url={invoice.invoice}
              showItems
            />

          </CardContent>
        </Card>
      ))}

      {invoices.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-500">No invoices are available for download yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InvoicesTab;