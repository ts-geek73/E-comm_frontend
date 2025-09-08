import { formatDate } from "@components/Functions";
import ConfirmDelete from "@components/Header/ConfirmDelete";
import { Button } from "@components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { IStockEntry } from "@types";
import {
  AlertCircle,
  Calendar,
  Eye,
  FileText,
  Hash,
  Package,
  PackageOpen,
  Trash2,
  User,
} from "lucide-react";

const StockTable: React.FC<{
  stockEntries: IStockEntry[];
  onView: (entry: IStockEntry) => void;
  onDelete: (entry: IStockEntry) => void;
}> = ({ stockEntries, onDelete, onView }) => {
  return (
    <div className="rounded-lg border border-gray-200 shadow-sm bg-white overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Stock Inventory
            </h2>
            <p className="text-sm text-gray-600">
              {stockEntries.length}{" "}
              {stockEntries.length === 1 ? "entry" : "entries"} found
            </p>
          </div>
        </div>
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
            <TableHead className="w-16 text-center font-semibold text-gray-700">
              <div className="flex items-center justify-center gap-1">
                <Hash className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <PackageOpen className="h-4 w-4 text-blue-600" />
                Stock Name
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700 min-w-[200px]">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-600" />
                Description
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700 w-32">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                Date
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700 w-32">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-orange-600" />
                Added By
              </div>
            </TableHead>
            <TableHead className="text-center font-semibold text-gray-700 w-24">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockEntries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12">
                <div className="flex flex-col items-center gap-3 text-gray-500">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <PackageOpen className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      No stock entries found
                    </p>
                    <p className="text-sm text-gray-500">
                      Add your first stock entry to get started
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            stockEntries.map((entry, index) => (
              <TableRow
                key={entry._id}
                className={`
                                    border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150
                                    ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}
                                `}
              >
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      {index + 1}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-gray-900 text-sm">
                      {entry.stock_name}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  {entry.description ? (
                    <div className="group relative">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {entry.description}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm italic">
                        No description available
                      </span>
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">
                      {formatDate(entry.date)}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {entry.added_by}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(entry)}
                      className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <ConfirmDelete
                      title="Delete Stock Entry"
                      description={`Are you sure you want to delete "${entry.stock_name}"? This action cannot be undone.`}
                      onConfirm={() => onDelete(entry)}
                      trigger={
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StockTable;
