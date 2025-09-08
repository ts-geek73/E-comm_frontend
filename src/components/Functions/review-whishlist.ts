import api from "@/lib/axios";
import { IProductData } from "@types";
import { ReviewFecth } from "@types";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const fetchReviews = async ({ productId, userId }: { productId: string; userId?: string }) => {
  try {
    if (!productId || productId === "undefined") return;

    const url = userId
      ? `/review/${productId}/user/${userId}`
      : `/review/${productId}/user/id`;

    const response = await api.get(url);
    const data = response.data;

    if (Array.isArray(data.reviews)) {
      const { reviews, otherReviews = [] } = data as ReviewFecth;
      return { reviews, otherReviews };
    } else {
      return { reviews: [], otherReviews: [] };
    }
  } catch (error) {
    console.log("Error fetching reviews:", error);
    //   if (error instanceof AxiosError) {
    //     toast.error(error.response?.data?.message );
    // } else {
    //     toast.error("Failed to fetching reviews.");
    // }
    return { reviews: [], otherReviews: [] };
  }
};


export const handleDeleteReview = async ({ id, user_id }: { id: string, user_id: string }) => {
  try {
    await api.delete(`/review/${id}/user/${user_id}`);
    toast.success("Review deleted");
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message);
    } else {
      toast.error("Failed to delete review");
    }
  }
};

export const getLocalWishlist = (): IProductData[] => {
  try {
    return JSON.parse(localStorage.getItem("wishlist") || "[]");
  } catch (e) {
    console.warn("Error reading wishlist from localStorage:", e);
    return [];
  }
};

export const addToWishlist = async (
  user_id: string,
  product: IProductData
): Promise<boolean> => {
  const wishlist = getLocalWishlist();
  const isAlreadyWishlisted = wishlist.some(item => item._id === product._id);

  let updatedWishlist;

  if (isAlreadyWishlisted) {
    updatedWishlist = wishlist.filter(item => item._id !== product._id);
  } else {
    updatedWishlist = [...wishlist, product];
  }

  localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

  if (!user_id || user_id.trim() === "") {
    console.log("Updated Guest Wishlist:", updatedWishlist);
    return true;
  }

  try {
    await syncGuestWishlistOnLogin(user_id, isAlreadyWishlisted ? undefined : product._id);
  } catch (error) {
    console.error("Add to wishlist sync error:", error);
  }

  return true;
};


export const getWishlist = async (user_id: string): Promise<string[]> => {
  try {
    const response = await api.get("users/whishlist", {
      params: { user_id },
    });

    return response.data.data.productIds as string[];
  } catch (error) {
    console.error("Get Wishlist Error:", error);
    return [];
  }
};

export const syncGuestWishlistOnLogin = async (
  user_id: string,
  productId?: string,
  productIds?: string[]
): Promise<string[]> => {
  try {
    const response = await api.post(
      "users/whishlist",
      {
        productIds,
        productId,
      },
      {
        params: { user_id },
      }
    );

    return response.data.data.products as string[];
  } catch (error) {
    console.error("Sync Wishlist Error:", error);
    return [];
  }
};

export const removeFromWishlist = async (
  user_id: string,
  productIds?: string[],
  productId?: string
) => {
  try {
    const response = await api.delete("users/whishlist", {
      data: { productIds, productId },
      params: { user_id },
    });

    return response.data.products as string[]; // updated product IDs
  } catch (error) {
    console.error("Remove from Wishlist Error:", error);
    return [];
  }
};

export const handleWishlistToggle = async (product: IProductData, userId: string, currentlyWishlisted: boolean) => {

  if (currentlyWishlisted) {
    // Remove from wishlist
    if (userId) {
      await removeFromWishlist(userId, undefined, product._id);
    }
    // Remove from localStorage as well
    const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const updatedLocal = localWishlist.filter((p: IProductData) => p._id !== product._id);
    localStorage.setItem('wishlist', JSON.stringify(updatedLocal));
  } else {
    // Add to wishlist
    await addToWishlist(userId, product);
  }

  // Refresh product list to update wishlist status UI
  // await refresh();
};