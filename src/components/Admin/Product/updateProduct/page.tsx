"use client";
import { useProductFetch } from "@/hooks";
import PaginationComp from "@components/Product/PaginationComp";
import { Filters, IImageUrl, IProductData } from "@types";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import {
  handleDelete,
  handleEditClick,
  handleSuccessFunction,
} from "../../../Functions/product";
import { ProductChartsSection, ProductForm, ProductTableView } from "../index";

ChartJS.register(
  BarElement,
  CategoryScale,
  RadialLinearScale,
  PointElement,
  Filler,
  LineElement,
  ArcElement,
  LinearScale,
  Tooltip,
  Legend
);

const ProductTable: React.FC = () => {
  const [productArras, setProducts] = useState<IProductData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage] = useState(12);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [editingProduct, setEditingProduct] = useState<IProductData | null>(
    null
  );

  // Create empty filters object
  const filters: Filters = {};

  // Use the hook with the proper filters object
  const { products, totalLength, isLoading, ordersData, error } =
    useProductFetch(currentPage, productPerPage, filters);

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
            url: editingProduct.image.url,
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
                url: img.url,
              });
            }
          });
        }

        setEditingProduct((prev) =>
          prev
            ? {
                ...prev,
                imageUrls: initialImages,
              }
            : null
        );
      }
    }
  }, [editingProduct]);

  return (
    <div className="w-full py-8 px-2 space-y-8">
      <h1 className="text-4xl font-semibold text-center text-gray-900">
        Product Management
      </h1>

      {err && <p className="text-center text-red-600">{err}</p>}

      <ProductChartsSection products={productArras} orders={ordersData} />

      <ProductTableView
        products={productArras}
        loading={loading}
        currentPage={currentPage}
        productPerPage={productPerPage}
        onEditClick={(product: IProductData) => {
          handleEditClick(product, setEditingProduct);
        }}
        onDelete={(productId: string) => {
          handleDelete(productId, setProducts, setTotalProducts);
        }}
      />

      {editingProduct && (
        <ProductForm
          onSuccess={(msg: string) =>
            handleSuccessFunction(
              msg,
              editingProduct,
              setProducts,
              setEditingProduct
            )
          }
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
