'use client'
import PaginationComp from "@/app/Components/Product/PaginationComp";
import api from "@/utils/axoins";
import { useEffect, useState } from "react";
import { LiaEdit } from "react-icons/lia";
import { MdDeleteOutline } from "react-icons/md";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast, ToastContainer } from "react-toastify";

interface IProduct {
    _id: string;
    category_id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: { url: string };
    features: string[];
    brand: string;
    rating: number;
}

interface IResponse {
    length: number;
    datas: IProduct[];
}

const ProductTable: React.FC = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [productPerPage] = useState(12);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await api.get<IResponse>(
                    `product/custome?start=${ (currentPage - 1) * productPerPage}&length=${productPerPage}`
                );

                if (response && response.data) {
                    setProducts(response.data.datas);
                    setTotalProducts(response.data.length);
                } else {
                    setError("No products found");
                }
            } catch (err) {
                setError("Error fetching products");
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, productPerPage]);

    const editBtnClick = (product: IProduct) => {
        setEditingProduct(product);
    };

    const handleEditSubmit = async (product: IProduct) => {
        try {
            const response = await api.put(`/product/${product._id}`, product);
            if (response.status === 200) {
                setProducts((prev) => prev.map((p) => (p._id === product._id ? product : p)));
                setEditingProduct(null);
                toast.success("Product updated successfully");
            }
        } catch (err) {
            console.error("Error updating product:", err);
        }
    };

    const deleteBtnClick = async (productId: string) => {
        try {
            const response = await api.delete(`/product/${productId}`);
            if (response.status === 200) {
                toast.success("Product deleted successfully");
                setProducts((prev) => prev.filter((product) => product._id !== productId));
            }
        } catch (err) {
            console.error("Error deleting product:", err);
        }
    };

    const handleDelete = (productId: string) => {
        deleteBtnClick(productId);
    };

    return (
        <div className="w-full max-h-screen overflow-auto space-y-8">
            
            <h1 className="text-4xl font-semibold text-center text-gray-900">Product Management</h1>

            {loading && <p className="text-center text-blue-500">Loading products...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}

            <div className="overflow-x-auto shadow-lg border border-gray-300 rounded-lg">
                <table className="min-w-full table-auto">
                    <thead className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                        <tr>
                            <th className="py-4 px-6 text-left font-semibold text-sm tracking-wider"> </th>
                            <th className="py-4 px-6 text-left font-semibold text-sm tracking-wider">Product Name</th>
                            <th className="py-4 px-6 text-left font-semibold text-sm tracking-wider">Description</th>
                            <th className="py-4 px-6 text-left font-semibold text-sm tracking-wider">Price</th>
                            <th className="py-4 px-6 text-left font-semibold text-sm tracking-wider">Stock</th>
                            <th className="py-4 px-6 text-left font-semibold text-sm tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {products.map((product, index) => (
                            <tr key={product._id} className="border-b hover:bg-gray-50 transition">
                                <td className="py-3 px-6 text-sm text-gray-700">{(currentPage - 1) * productPerPage + index + 1}</td>
                                <td className="py-3 px-6 text-sm text-blue-600 font-medium">{product.name}</td>
                                <td className="py-3 px-6 text-sm text-gray-600">{product.description}</td>
                                <td className="py-3 px-6 text-sm text-gray-800">{product.price.toFixed(2)} Rs.</td>
                                <td className="py-3 px-6 text-sm text-gray-700">{product.stock}</td>
                                <td className="py-3 px-6 text-sm flex justify-center space-x-4">
                                    <button
                                        onClick={() => editBtnClick(product)}
                                        className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out transform hover:scale-105"
                                    >
                                        <LiaEdit size={20} />
                                    </button>

                                    <AlertDialog>
                                        <AlertDialogTrigger>
                                            <button
                                                className="text-red-600 hover:text-red-800 transition duration-200 ease-in-out transform hover:scale-105"
                                            >
                                                <MdDeleteOutline size={20} />
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                            </AlertDialogHeader>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete this product? This action cannot be undone.
                                            </AlertDialogDescription>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(product._id)}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {/* className="w-full p-3 border border-gray-300 rounded focus:ring-blue-500" */}
            {editingProduct && (
                <Dialog open={true} onOpenChange={(open) => !open && setEditingProduct(null)}>
                    <DialogTrigger />
                    <DialogContent className="w-full max-h-[80vh] overflow-auto bg-white p-6 rounded-lg shadow-lg">
                        <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                        </DialogHeader>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (editingProduct) {
                                    handleEditSubmit(editingProduct);
                                }
                            }}
                        >
                            <div className="space-y-4">
                                <div className="mb-4">
                                    <label className="block text-gray-700">Product Name</label>
                                    <input
                                        type="text"
                                        value={editingProduct.name}
                                        onChange={(e) => setEditingProduct((prev) => ({ ...prev!, name: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700">Description</label>
                                    <textarea
                                        value={editingProduct.description}
                                        onChange={(e) =>
                                            setEditingProduct((prev) => ({ ...prev!, description: e.target.value }))
                                        }
                                        className="w-full p-3 border border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700">Price</label>
                                    <input
                                        type="number"
                                        value={editingProduct.price}
                                        onChange={(e) =>
                                            setEditingProduct((prev) => ({ ...prev!, price: parseFloat(e.target.value) }))
                                        }
                                        className="w-full p-3 border border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700">Image URL</label>
                                    <input
                                        type="text"
                                        value={editingProduct.imageUrl.url}
                                        onChange={(e) =>
                                            setEditingProduct((prev) => ({
                                                ...prev!,
                                                imageUrl: { ...prev!.imageUrl, url: e.target.value },
                                            }))
                                        }
                                        className="w-full p-3 border border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700">Brand</label>
                                    <input
                                        type="text"
                                        value={editingProduct.brand}
                                        onChange={(e) =>
                                            setEditingProduct((prev) => ({ ...prev!, brand: e.target.value }))
                                        }
                                        className="w-full p-3 border border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700">Stock</label>
                                    <input
                                        type="number"
                                        value={editingProduct.stock}
                                        onChange={(e) =>
                                            setEditingProduct((prev) => ({ ...prev!, stock: parseInt(e.target.value) }))
                                        }
                                        className="w-full p-3 border border-gray-300 rounded focus:ring-blue-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700">Features</label>
                                    {editingProduct.features.map((feature, index) => (
                                        <div key={index} className="mb-2">
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(e) => {
                                                    const updatedFeatures = [...editingProduct.features];
                                                    updatedFeatures[index] = e.target.value;
                                                    setEditingProduct((prev) => ({
                                                        ...prev!,
                                                        features: updatedFeatures,
                                                    }));
                                                }}
                                                className="w-full p-3 border border-gray-300 rounded focus:ring-blue-500"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingProduct((prev) => ({
                                                ...prev!,
                                                features: [...prev!.features, ""],
                                            }));
                                        }}
                                        className="text-blue-500 mt-2"
                                    >
                                        Add Feature
                                    </button>
                                </div>

                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingProduct(null)}
                                        className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            )}

            <ToastContainer />
            <PaginationComp
                length={totalProducts}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
};

export default ProductTable;
