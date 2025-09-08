"use client";
import ConfirmDelete from "@components/Header/ConfirmDelete";
// import { usePermission } from "@/hooks/usePermission";
import { IProductData } from "@types";
import { LiaEdit } from "react-icons/lia";
import { MdDeleteOutline } from "react-icons/md";

interface ProductTableViewProps {
  products: IProductData[];
  loading: boolean;
  currentPage: number;
  productPerPage: number;
  onEditClick: (product: IProductData) => void;
  onDelete: (productId: string) => void;
}

export const ProductTableView: React.FC<ProductTableViewProps> = ({
  products,
  loading,
  currentPage,
  productPerPage,
  onEditClick,
  onDelete,
}) => {
  // const { hasPermission } = usePermission();

  return (
    <table className="min-w-full table-auto overflow-x-auto shadow-lg border border-gray-300 rounded-lg">
      <thead className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
        <tr>
          <th className="py-4 px-6 text-left font-semibold text-sm tracking-wider">
            {" "}
          </th>
          <th className="py-4 px-6 text-left font-semibold text-sm tracking-wider">
            Product Name
          </th>
          <th className="py-4 px-6 text-left font-semibold text-sm tracking-wider">
            Description
          </th>
          <th className="py-4 px-6 text-left font-semibold text-sm tracking-wider">
            Price
          </th>
          <th className="py-4 px-6 text-left font-semibold text-sm tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {loading ? (
          <tr>
            <td colSpan={5} className="py-10 text-center text-blue-500">
              Loading products...
            </td>
          </tr>
        ) : products.length === 0 ? (
          <tr>
            <td colSpan={5} className="py-10 text-center text-gray-500">
              No products found
            </td>
          </tr>
        ) : (
          products.map((product, index) => (
            <tr key={product._id} className="hover:bg-gray-50 transition">
              <td className="py-3 px-6 text-sm text-gray-700">
                {(currentPage - 1) * productPerPage + index + 1}
              </td>
              <td className="py-3 px-6 text-sm text-blue-600 font-medium">
                {product.name}
              </td>
              <td className="py-3 px-6 text-sm text-gray-600 max-w-xs truncate">
                {product.short_description ?? product.description}
              </td>
              <td className="py-3 px-6 text-sm text-gray-800">
                {product.price?.toFixed(2)} Rs.
              </td>
              <td className="py-3 px-6 text-sm flex space-x-4">
                <button
                  onClick={() => onEditClick(product)}
                  className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out transform hover:scale-105"
                >
                  <LiaEdit size={20} />
                </button>
                {/* {hasPermission("product.update") && */}
                <ConfirmDelete
                  title="Confirm Deletion"
                  description="Are you sure you want to delete this product? This action cannot be undone."
                  onConfirm={() => onDelete(product._id)}
                  trigger={
                    <button className="text-red-600 hover:text-red-800 transition duration-200 ease-in-out transform hover:scale-105">
                      <MdDeleteOutline size={20} />
                    </button>
                  }
                />
                {/* } */}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
