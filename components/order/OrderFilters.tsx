import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderFilters } from '@/types/user';
import { Filter, SortAsc, SortDesc } from 'lucide-react';

export const OrderFiltersComponent = ({
  orderFilters,
  handleOrderFilterChange,
  clearOrderFilters,
}: {
  orderFilters: OrderFilters;
  handleOrderFilterChange: (key: string, value: any) => void;
  clearOrderFilters: () => void;
}) => (
  <Card className="mb-6">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters & Sorting
        </h3>
        <Button variant="outline" size="sm"
          onClick={clearOrderFilters}
        >
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        {/* <div className="space-y-2">
          <Label htmlFor="order-search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="order-search"
              placeholder="Search orders..."
              value={orderFilters.search}
              onChange={(e) => handleOrderFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div> */}

        {/* Status Filter */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={orderFilters.status}
            onValueChange={(value) => handleOrderFilterChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="complete">Complete</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select
            value={orderFilters.sortBy}
            onValueChange={(value) => handleOrderFilterChange('sortBy', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="totalAmount">Total Amount</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="orderNumber">Order Number</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order */}
        <div className="space-y-2">
          <Label>Sort Order</Label>
          <Select
            value={orderFilters.sortOrder}
            onValueChange={(value) => handleOrderFilterChange('sortOrder', value as 'asc' | 'desc')}
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