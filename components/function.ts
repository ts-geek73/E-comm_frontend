import { toast } from "react-toastify";
import api from "@/lib/axios";
import { BrandCategory, IProductData } from "@/types/product";
import { AxiosError } from "axios";
import { ReviewFecth } from "@/types/review";

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
    console.error('Error in file upload:', err);

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
    console.error('Error in file upload:', err);

    if (err instanceof AxiosError) {
    console.error("Error deleting product:", err);
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
  toast.success(message || "Product updated successfully");

  if (editingProduct) {
    setProducts((prev) =>
      prev.map((p) => (p._id === editingProduct._id ? editingProduct : p))
    );
  }

  setEditingProduct(null);
};



export const fetchReviews = async ({ productId, userId }: { productId: string, userId: string }) => {
    try {
      if(productId !== "undefined" && userId !== "undefined" ){

        const { data } = await api.get(`/review/${productId}/user/${userId}`);
        if (Array.isArray(data.reviews)) {
          const { reviews, otherReviews} = data as ReviewFecth
          return ({ reviews, otherReviews});
        } else {
          return ([]);
        }
      }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      return ([]);
    }
  };


  export const handleDeleteReview = async ({id , user_id}:{id: string, user_id:string}) => {
      try {
        await api.delete(`/review/${id}/user/${user_id}`);
        toast.success("Review deleted");
      } catch {
        toast.error("Failed to delete review");
      }
    };
