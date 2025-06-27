import api from "@/lib/axios";
import { BrandCategory, IProductData } from "@/types/product";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const handleEditClick = (
  product: IProductData,
  setEditingProduct: React.Dispatch<React.SetStateAction<IProductData | null>>
) => {
  setEditingProduct(product);
};

export const deleteProductById = async (
  productId: string,
  setProducts: React.Dispatch<React.SetStateAction<IProductData[]>>,
  setTotalProducts: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    const response = await api.delete(`/product/${productId}`);
    if (response.status === 200) {
      toast.success("Product deleted successfully");
      setProducts((prev) => prev.filter((product) => product._id !== productId));
      setTotalProducts((prev) => prev - 1);
    }
  } catch (err: unknown) {
    console.log('Error in file upload:', err);

    // Optional: Narrow the error if it's an AxiosError
    if (err instanceof AxiosError) {
      toast.error(err.message || "Failed to delete product");
    }
  }
};

export const getBrandsandCategories = async () => {
  try {
    const response = await api.get(`/product/combos`);
    if (response.status === 200) {
      const { brands, categories } = response.data.data as BrandCategory;
      return { brands, categories };
    }
  } catch (err: unknown) {
    console.log('Error in file upload:', err);

    if (err instanceof AxiosError) {
      console.log("Error deleting product:", err);
      toast.error(err.message || "Failed to delete product");
    }
  }
};

export const handleDelete = (
  productId: string,
  setProducts: React.Dispatch<React.SetStateAction<IProductData[]>>,
  setTotalProducts: React.Dispatch<React.SetStateAction<number>>
) => {
  deleteProductById(productId, setProducts, setTotalProducts);
};

export const handleSuccessFunction = (
  message: string,
  editingProduct: IProductData | null,
  setProducts: React.Dispatch<React.SetStateAction<IProductData[]>>,
  setEditingProduct: React.Dispatch<React.SetStateAction<IProductData | null>>
) => {
  // toast.success(message || "Product updated successfully");

  if (editingProduct) {
    setProducts((prev) =>
      prev.map((p) => (p._id === editingProduct._id ? editingProduct : p))
    );
  }

  setEditingProduct(null);
};

export const formatDate = (dateString: string | number | Date) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatAmount = (amount: number) => {
  return amount;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'complete':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

