"use client";

import { useProductFetch } from "@/hooks";
import { useUser } from "@clerk/nextjs";
import {
  addStockEntry,
  deleteStockEntry,
  fetchStockEntries,
  updateStockEntry,
} from "@components/Functions";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { IStockEntry } from "@types";
import { Plus } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { StockDetailsModal, StockTable } from ".";

const StockManagement: React.FC = () => {
  const [selectedStockEntry, setSelectedStockEntry] = useState<
    IStockEntry | undefined
  >();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stockEntries, setStockEntries] = useState<IStockEntry[] | null>(null);
  const { products, isLoading, error } = useProductFetch(1, 120);
  const { user } = useUser();
  const hasLoaded = useRef<boolean>(false);

  const loadStockEntries = async () => {
    const data = await fetchStockEntries();
    if (data) {
      setStockEntries(data.stockEntries);
    }
  };

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    loadStockEntries();
  });

  const handleViewDetails = (stockEntry: IStockEntry) => {
    setSelectedStockEntry(stockEntry);
    setIsModalOpen(true);
  };

  const handleNewEntry = () => {
    setSelectedStockEntry(undefined);
    setIsModalOpen(true);
  };

  const handleDeleteEntry = async (entry: IStockEntry) => {
    if (user) {
      if (!user.emailAddresses?.[0]?.emailAddress || !user.id) {
        console.log(
          "🚀 ~ handleSaveEntry ~ user:",
          user.emailAddresses?.[0]?.emailAddress,
          user.id
        );
        toast.error("User Not Found");
        return;
      }

      if (entry._id) {
        await deleteStockEntry(entry._id);
      }
      loadStockEntries();
    }
  };

  const handleSaveEntry = async (entry: IStockEntry) => {
    if (user) {
      if (!user.emailAddresses?.[0]?.emailAddress || !user.id) {
        console.log(
          "🚀 ~ handleSaveEntry ~ user:",
          user.emailAddresses?.[0]?.emailAddress,
          user.id
        );
        toast.error("User Not Found");
        return;
      }

      if (entry._id) {
        console.log("🚀 ~ handleSaveEntry ~ entry._id:", entry._id);
        await updateStockEntry(entry._id, {
          added_by: user.emailAddresses[0].emailAddress,
          stock_name: entry.stock_name,
          description: entry.description || "",
          date: entry.date,
          products: entry.products,
        });
      } else {
        await addStockEntry(
          {
            added_by: user.emailAddresses[0].emailAddress,
            stock_name: entry.stock_name,
            description: entry.description || "",
            date: entry.date,
            products: entry.products,
          },
          user.id
        );
      }

      setIsModalOpen(false);
      loadStockEntries();
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="grid">
            <CardTitle>Stock Management</CardTitle>
            <CardDescription>
              Manage your product stock entries and track inventory changes
            </CardDescription>
          </div>
          <Button onClick={handleNewEntry}>
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading || stockEntries === null ? (
          <div className="text-center py-8">
            <p>Loading stock entries...</p>
          </div>
        ) : (
          <>
            <StockTable
              stockEntries={stockEntries}
              onView={handleViewDetails}
              onDelete={handleDeleteEntry}
            />

            {user?.emailAddresses[0].emailAddress && isModalOpen === true && (
              <StockDetailsModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                stockEntry={selectedStockEntry}
                products={products}
                email={user?.emailAddresses[0].emailAddress}
                onSave={handleSaveEntry}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(StockManagement);
