// "use client"

// import { useState, useMemo } from "react"
// import { Eye, Plus, Search } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { ProductCombobox } from "./product-combobox"
// import { StockDetailsModal } from "./stock-details-modal"
// import { useProductFetch } from "@/hooks/use-product-fetch"
// import type { StockEntry, Filters } from "@/types"

// export default function StockManagement() {
//   const [currentPage, setCurrentPage] = useState(1)
//   const [productPerPage] = useState(10)
//   const [filters, setFilters] = useState<Filters>({})
//   const [selectedProduct, setSelectedProduct] = useState("")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedStockEntry, setSelectedStockEntry] = useState<StockEntry | undefined>()
//   const [isModalOpen, setIsModalOpen] = useState(false)

//   const { products, totalLength, isLoading, error, refresh } = useProductFetch(currentPage, productPerPage, filters)

// //   const filteredStockEntries = useMemo(() => {
// //     return stockEntries.filter((entry) => {
// //       const matchesProduct = !selectedProduct || entry.productId === selectedProduct
// //       const matchesSearch =
// //         !searchTerm ||
// //         entry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         entry.reason.toLowerCase().includes(searchTerm.toLowerCase())

// //       return matchesProduct && matchesSearch
// //     })
// //   }, [stockEntries, selectedProduct, searchTerm])

//   const handleSearch = () => {
//     setFilters({ search: searchTerm })
//   }

//   const handleViewDetails = (stockEntry: StockEntry) => {
//     setSelectedStockEntry(stockEntry)
//     setIsModalOpen(true)
//   }

//   const handleNewEntry = () => {
//     setSelectedStockEntry(undefined)
//     setIsModalOpen(true)
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   if (error) {
//     return (
//       <Card>
//         <CardContent className="pt-6">
//           <p className="text-destructive">Error: {error}</p>
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Stock Management</CardTitle>
//           <CardDescription>Manage your product stock entries and track inventory changes</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col sm:flex-row gap-4 mb-6">
//             <div className="flex-1">
//               <div className="flex gap-2">
//                 <Input
//                   placeholder="Search stock entries..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="flex-1"
//                 />
//                 <Button onClick={handleSearch} size="icon">
//                   <Search className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//             <ProductCombobox
//               products={products}
//               value={selectedProduct}
//               onValueChange={setSelectedProduct}
//               placeholder="Filter by product..."
//             />
//             <Button onClick={handleNewEntry}>
//               <Plus className="h-4 w-4 mr-2" />
//               New Entry
//             </Button>
//           </div>

//           {isLoading ? (
//             <div className="text-center py-8">
//               <p>Loading stock entries...</p>
//             </div>
//           ) : (
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Product</TableHead>
//                     <TableHead>Quantity</TableHead>
//                     <TableHead>Type</TableHead>
//                     <TableHead>Reason</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>User</TableHead>
//                     <TableHead className="text-right">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredStockEntries.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={7} className="text-center py-8">
//                         No stock entries found
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     filteredStockEntries.map((entry) => (
//                       <TableRow key={entry.id}>
//                         <TableCell className="font-medium">{entry.productName}</TableCell>
//                         <TableCell>{entry.quantity}</TableCell>
//                         <TableCell>
//                           <Badge variant={entry.type === "IN" ? "default" : "secondary"}>
//                             {entry.type === "IN" ? "Stock In" : "Stock Out"}
//                           </Badge>
//                         </TableCell>
//                         <TableCell className="max-w-[200px] truncate">{entry.reason}</TableCell>
//                         <TableCell>{formatDate(entry.createdAt)}</TableCell>
//                         <TableCell>{entry.userEmail}</TableCell>
//                         <TableCell className="text-right">
//                           <Button variant="ghost" size="icon" onClick={() => handleViewDetails(entry)}>
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <StockDetailsModal
//         open={isModalOpen}
//         onOpenChange={setIsModalOpen}
//         stockEntry={selectedStockEntry}
//         onSave={refresh}
//       />
//     </div>
//   )
// }
