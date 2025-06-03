import api from "@/lib/axios";
import getStripe from "@/lib/get-stripe";
import { ExtendedFormValues, FormValues } from "@/types/components";
import { BrandCategory, FetchParams, ICart, ICArtProductPayLoad, ICartresponce, IProductData, PromoCode } from "@/types/product";
import { ReviewFecth } from "@/types/review";
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
  toast.success(message || "Product updated successfully");

  if (editingProduct) {
    setProducts((prev) =>
      prev.map((p) => (p._id === editingProduct._id ? editingProduct : p))
    );
  }

  setEditingProduct(null);
};



export const fetchReviews = async ({ productId, userId }: { productId: string; userId?: string }) => {
  try {
    if (!productId || productId === "undefined") return;

    const url = userId
      ? `/review/${productId}/user/${userId}`
      : `/review/${productId}/user/id`;

    const { data } = await api.get(url);

    if (Array.isArray(data.reviews)) {
      const { reviews, otherReviews = [] } = data as ReviewFecth;
      return { reviews, otherReviews };
    } else {
      return { reviews: [], otherReviews: [] };
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return { reviews: [], otherReviews: [] };
  }
};


export const handleDeleteReview = async ({ id, user_id }: { id: string, user_id: string }) => {
  try {
    await api.delete(`/review/${id}/user/${user_id}`);
    toast.success("Review deleted");
  } catch {
    toast.error("Failed to delete review");
  }
};

export function getLocalCart(): ICart {
  const data = localStorage.getItem("cart");
  if (data) {
    try {
      return JSON.parse(data) as ICart;
    } catch (err) {
      console.warn("Failed to parse cart from localStorage:", err);
    }
  }
  return { products: [] };
}

export const syncGuestCartOnLogin = async (user_id: string) => {
  const cart = getLocalCart();
  console.log("Sync data", cart);

  if (cart.products.length === 0) return;
  const payloadProducts = cart.products.map(item => ({
    product_id:
      typeof item.product === "object" && "_id" in item.product
        ? item.product._id
        : item.product,
    qty: item.qty,
    notes: item.notes || ""
  }));

  console.log("Sync CAret Data:", payloadProducts);


  try {
    const response = await api.put('cart', {
      user_id,
      product: payloadProducts,
    });

    if (response.status === 200) {
      localStorage.removeItem('cart');
      console.log("Guest cart synced to user cart.");
    }
  } catch (error) {
    console.error("Cart sync failed:", error);
  }
};


export const addToCart = async (
  product: IProductData | ICArtProductPayLoad,
  quantity: number,
  user_id: string
): Promise<boolean> => {
  const cart = getLocalCart();

  const index = cart.products.findIndex(item => item.product._id === product._id);

  if (index >= 0) {
    cart.products[index].qty += quantity;
  } else {
    cart.products.push({
      product,
      qty: quantity,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  if (!user_id || user_id.trim() === "") {
    // Guest: store full product in localStorage
    console.log("Updated Guest Cart:", cart);
    return true;
  }


  try {
    await syncGuestCartOnLogin(user_id)

  } catch (error) {
    console.error("Add to cart sync error:", error);
  }

  return true;
};

export const fetchcart = async (user_id: string) => {
  try {
    if (user_id && user_id !== "") {
      await syncGuestCartOnLogin(user_id);


      const response = await api.get("/cart", {
        params: { user_id }
      });
      if (response.status === 200) {
        return response.data.data
      } else {
        return { cart: [], totalItems: 0, totalPrice: 0 };
      }

    }
  } catch (error) {
    console.log("fetch Cart Prodcuct error", error);

  }
}

export const removeFromCart = async (
  product_id: string,
  user_id: string = ""
): Promise<boolean> => {
  try {
    const cart = getLocalCart();

    cart.products = cart.products.filter(
      item => item.product._id.toString() !== product_id.toString()
    );

    localStorage.setItem("cart", JSON.stringify(cart));

    if (user_id && user_id !== "") {
      await api.delete("cart/item", {
        data: {

          user_id,
          product_id,
        }
      });
    }

    return true;
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return false;
  }
};

export const clearCart = async (user_id: string = ""): Promise<void> => {
  try {

    const emptyCart = { products: [] };
    localStorage.setItem("cart", JSON.stringify(emptyCart));
    console.log("Local cart cleared");

    if (user_id && user_id.trim() !== "") {
      const response = await api.delete("cart", {
        data: {
          user_id,
        }
      });

      if (response.status !== 200) {
        console.warn("Server cart clear failed");
      }
    }

  } catch (error) {
    console.error("Error clearing cart:", error);
  }
};

export const deleteAddress = async (email: string, address: FormValues) => {
  try {
    const response = await api.delete(`address`, {
      params: { email },
      data: { address },
    });
    return response.data.message as string;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('Delete Address Error:', error.response?.data);
    } else {
      console.error('Unknown Delete Address Error:', error);
    }
  }
};


export const saveAddresses = async (
  email: string,
  addresses: FormValues[]
) => {
  try {
    const res = await api.post('/address', { email, addresses });
    return res.data.data.addresses;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.log('Save Address Error:', error.response?.data || error.message);
    } else {
      console.log('Unknown Save Address Error:', error);
    }
  }
};


export const getAddresses = async (email: string) => {
  try {
    const res = await api.get(`address?email=${email}`);
    return res.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('Get Addresses Error:', error.response?.data || error.message);
    } else {
      console.error('Unknown Get Addresses Error:', error);
    }
  }
};


export const fetchPromos = async ({ page = 1, limit = 12, sortField = 'createdAt', sortOrder = 'desc' }: FetchParams) => {
  try {
    const { data } = await api.get(`/promocode?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`);
    return data?.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return error.message || 'Failed to fetch';
    } else {
      return 'Failed to fetch';
    }
  }
};


export const deletePromo = async (_id: string): Promise<void> => {
  await api.delete(`/promocode/${_id}`);
};

export const savePromo = async (promo: PromoCode): Promise<void> => {
  if (promo._id) {
    await api.put(`/promocode/${promo._id}`, promo);
  } else {
    await api.post('/promocode', promo);
  }
};

// components/function.ts
export const validatePromo = async (codes: string[], amount: number) => {
  try {
    const codeParams = codes.map(code => `codes=${encodeURIComponent(code)}`).join('&');
    const response = await api.get(`/promocode?amount=${amount}&${codeParams}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || "Invalid promo code");
    }
    throw new Error("Invalid promo code");
  }
};



export const makePayMent = async (cartData: ICartresponce, email: string, finalPrice: number, address: ExtendedFormValues, coupons?: string[]) => {
  try {
    console.log("enter");

    const stripe = await getStripe();
    console.log("exit");

    if (!stripe) {
      console.log("Stripe failed to load");
      toast.error("Stripe failed to load");
      return;
    }
    console.log("pass stripe 1");

    const body = {
      products: cartData,
      finalPrice,
      email,
      billing: address.billing,
      shipping: address.shipping,
      coupons,
    };

    console.log("Data for the Payment:=", body);


    const response = await api.post(`/payment/create-checkout-session`, {
      body
    });

    const sessionId = response.data.session.id;

    const result = await stripe.redirectToCheckout({ sessionId });

    if (result.error) {
      console.error("Stripe checkout error:", result.error.message);
    }
  } catch (error) {
    console.error("Payment initiation failed:", error);
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


  export const handleWishlistToggle = async (product: IProductData, userId: string,currentlyWishlisted: boolean) => {

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