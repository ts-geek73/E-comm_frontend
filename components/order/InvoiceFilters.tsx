'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InvoiceFilters } from '@/types/user';
import { Filter, SortAsc, SortDesc } from 'lucide-react';

export const InvoiceFiltersComponent = ({ invoiceFilters,
  handleInvoiceFilterChange,
  clearInvoiceFilters,
}: {
  invoiceFilters: InvoiceFilters;
  handleInvoiceFilterChange: (key: string, value: string) => void;
  clearInvoiceFilters: () => void;
}) => (
  <Card className="mb-6">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters & Sorting
        </h3>
        <Button variant="outline" size="sm"
          onClick={clearInvoiceFilters}
        >
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        {/* <div className="space-y-2">
          <Label htmlFor="invoice-search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="invoice-search"
              placeholder="Search invoices..."
              value={invoiceFilters.search}
              onChange={(e) => handleInvoiceFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div> */}

        {/* Sort By */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select
            value={invoiceFilters.sortBy}
            onValueChange={(value) => handleInvoiceFilterChange('sortBy', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="invoiceNumber">Invoice Number</SelectItem>
              <SelectItem value="totalAmount">Total Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order */}
        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Select
            value={invoiceFilters.sortOrder}
            onValueChange={(value) => handleInvoiceFilterChange('sortOrder', value as 'asc' | 'desc')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">
                <div className="flex items-center gap-2">
                  <SortDesc className="w-4 h-4" />
                  Descending
                </div>
              </SelectItem>
              <SelectItem value="asc">
                <div className="flex items-center gap-2">
                  <SortAsc className="w-4 h-4" />
                  Ascending
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>
    </CardContent>
  </Card>
);

