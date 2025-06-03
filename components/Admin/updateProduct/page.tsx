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
import { Bar, Bubble, Doughnut, Line, Pie, PolarArea, Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement,
    PointElement,
    Tooltip,
    RadialLinearScale,
    LineElement,
    Filler,
    Legend,
} from 'chart.js';
import ProductChartsSection from "./ProductCharts";
import ProductTableView from "./ProductTableView";

ChartJS.register(BarElement, CategoryScale, RadialLinearScale, PointElement, Filler, LineElement, ArcElement, LinearScale, Tooltip, Legend);


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

    const handleEditClickWrapper = (product: IProductData) => {
        handleEditClick(product, setEditingProduct);
    };

    const handleDeleteWrapper = (productId: string) => {
        handleDelete(productId, setProducts, setTotalProducts);
    };

    return (
        <div className="w-full max-h-screen overflow-auto space-y-8">
            <h1 className="text-4xl font-semibold text-center text-gray-900">Product Management</h1>

            {err && <p className="text-center text-red-600">{err}</p>}

            <ProductChartsSection products={productArras} />

            <ProductTableView
                products={productArras}
                loading={loading}
                currentPage={currentPage}
                productPerPage={productPerPage}
                onEditClick={handleEditClickWrapper}
                onDelete={handleDeleteWrapper}
            />

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