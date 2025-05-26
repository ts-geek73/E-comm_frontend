'use client'
import ConfirmDelete from "@/components/Header/ConfirmDelete";
import PaginationComp from "@/components/Product/PaginationComp";
import { useProductFetch } from "@/hooks";
import { Filters, IImageUrl, IProductData } from "@/types/product";
import { useEffect, useState } from "react";
import { LiaEdit } from "react-icons/lia";
import { MdDeleteOutline } from "react-icons/md";
import {
    handleDelete,
    handleEditClick,
    handleSuccessFunction
} from "../../function";
import ProductForm from "../AdminProductFom";


const ProductTable: React.FC = () => {
    const [productArras, setProducts] = useState<IProductData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [err, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productPerPage] = useState(12);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [editingProduct, setEditingProduct] = useState<IProductData | null>(null);

    // Create empty filters object
    const filters: Filters = {};

    // Use the hook with the proper filters object
    const { products, totalLength, isLoading, error } = useProductFetch(
        currentPage,
        productPerPage,
        filters
    );

    // Monitor hook values via console log for debugging
    useEffect(() => {
        console.log("Hook values:", {
            products: products?.length || 0,
            totalLength,
            isLoading,
            error
        });
    }, [products, totalLength, isLoading, error]);

    useEffect(() => {
        if (products) {
            setProducts(products);
        }

        if (totalLength !== undefined) {
            setTotalProducts(totalLength);
        }

        if (isLoading !== undefined) {
            setLoading(isLoading);
        }

        if (error) {
            setError(error);
        }
    }, [products, totalLength, isLoading, error]);

    useEffect(() => {
        if (editingProduct) {
            if (!editingProduct.images) {
                const initialImages: IImageUrl[] = [];

                if (editingProduct.image?.url) {
                    initialImages.push({
                        name: editingProduct.image.name || "Main Product Image",
                        url: editingProduct.image.url
                    });
                }
                if (
                    editingProduct.images &&
                    Array.isArray(editingProduct.images) &&
                    (editingProduct.images as IImageUrl[]).length > 0
                ) {
                    (editingProduct.images as IImageUrl[]).forEach((img: IImageUrl) => {
                        if (!editingProduct.image || img.url !== editingProduct.image.url) {
                            initialImages.push({
                                name: img.name || "Product Image",
                                url: img.url
                            });
                        }
                    });
                }


                setEditingProduct((prev) => prev ? {
                    ...prev,
                    imageUrls: initialImages
                } : null);
            }
        }
    }, [editingProduct]);

    return (
        <div className="w-full max-h-screen overflow-auto space-y-8">
            <h1 className="text-4xl font-semibold text-center text-gray-900">Product Management</h1>

            {err && <p className="text-center text-red-600">{err}</p>}

            <table className="min-w-full table-auto overflow-x-auto shadow-lg border border-gray-300 rounded-lg">
                <thead className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                    <tr>
                        <th className="py-4 px-6 text-left font-semibold text-sm tracking-wider"> </th>
                        <th className="py-4 px-6 text-left font-semibold text-sm tracking-wider">Product Name</th>
                        <th className="py-4 px-6 text-left font-semibold text-sm tracking-wider">Description</th>
                        <th className="py-4 px-6 text-left font-semibold text-sm tracking-wider">Price</th>
                        <th className="py-4 px-6 text-left font-semibold text-sm tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="py-10 text-center text-blue-500">
                                Loading products...
                            </td>
                        </tr>
                    ) : productArras.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="py-10 text-center text-gray-500">
                                No products found
                            </td>
                        </tr>
                    ) : (
                        productArras.map((product, index) => (
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
                                        onClick={() => handleEditClick(product, setEditingProduct)}
                                        className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out transform hover:scale-105"
                                    >
                                        <LiaEdit size={20} />
                                    </button>

                                    <ConfirmDelete
                                        title="Confirm Deletion"
                                        description="Are you sure you want to delete this product? This action cannot be undone."
                                        onConfirm={() =>
                                            handleDelete(product._id, setProducts, setTotalProducts)
                                        }
                                        trigger={
                                            <button className="text-red-600 hover:text-red-800 transition duration-200 ease-in-out transform hover:scale-105">
                                                <MdDeleteOutline size={20} />
                                            </button>
                                        }
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {editingProduct && (
                <ProductForm
                    onSuccess={(msg: string) => handleSuccessFunction(msg, editingProduct, setProducts, setEditingProduct)}
                    productData={editingProduct}
                    formTitle="Update Product"
                    formSubtitle="Edit the details of your existing product"
                    purpose="Update"
                    isEdit={true}
                />
            )}

            {totalProducts > 0 && (
                <PaginationComp
                    length={totalProducts}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            )}
        </div>
    );
};

export default ProductTable;