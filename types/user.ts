export interface UserData {
    userId: string;
    sessionId: string;
    clerkId: string;
    email: string;
    name: string;
    roles_id?: string;
}

export interface IOrderItem {
  _id: string;
  product_id: string;
  name: string;
  qty: number;
  price: number;
  notes?: string;
  product?: {
    name: string;
    price: number;
    notes?: string;
  };
}

export interface IOrder {
  _id: string;
  orderNumber?: string;
  amount: number;
  createdAt: string | number | Date;
  date?: string;
  totalAmount?: number;
  invoiceUrl?: string;
status: 'pending' | 'paid' | 'failed' | 'shipped' |"return"| 'complete' | 'cancelled';
  items: IOrderItem[];
  email?: string;
  session_id?: string;
  shipping_address?: string;
  billing_address?: string;
}

export interface IInvoice {
  _id: string;
  invoice: string; // URL string
  orderId: IOrder;
}

export interface OrderFilters {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  status?: string;
  search?: string;
  limit: number;
  dateTo?: string;
  dateFrom?: string;
}

export interface InvoiceFilters {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  limit: number;
  search?: string;
  dateTo?: string;
  dateFrom?: string;
}

  export const defaultOrderFilters: OrderFilters = {
    sortBy: 'createdAt',
    sortOrder: 'desc',
    status: 'all',
    search: '',
    limit: 5,
    dateTo: '',
    dateFrom: ""
  }

  export const defaultInvoiceFilters: InvoiceFilters = {
    sortBy: 'createdAt',
    sortOrder: 'desc',
    limit: 5,
    search: '',
    dateTo: '',
    dateFrom: ""
  }
