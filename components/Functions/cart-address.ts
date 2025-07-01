import api from "@/lib/axios";
import getStripe from "@/lib/get-stripe";
import { ExtendedFormValues, FormValues } from "@/types/components";
import { ICart, ICArtProductPayLoad, ICartresponce, IProductData } from "@/types/product";
import axios, { AxiosError } from "axios";
import saveAs from "file-saver";
import { toast } from "react-toastify";

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

  console.log("Sync Cart Data:", payloadProducts);


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
  console.log("🚀 ~ cart:", cart)

  const index = cart.products.findIndex(item => item.product._id === product._id);
  console.log("🚀 ~ index:", index)

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
    console.log("Updated Guest Cart:", cart);
    return true
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
      console.log("🚀 ~ fetchcart ~ response:", response)
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
      data: { address, },
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

export const makePayMent = async (cartData: ICartresponce, email: string, finalPrice: number, address: ExtendedFormValues, coupons?: string[]) => {
  try {
    console.log("enter");

    if (cartData.inStock && cartData.inStock?.length < 1) {
      toast.error("Alteast One Item with Valid Stock should have.")
      return
    }

    const stripe = await getStripe();
    console.log("exit");

    if (!stripe) {
      console.log("Stripe failed to load");
      toast.error("Stripe failed to load");
      return;
    }
    console.log("pass stripe 1");


    const body = {
      products: {
        ...cartData,
        cart:cartData.inStock,
      },
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
    console.log("Payment initiation failed:", error);
    if (error instanceof AxiosError) {
      toast.error(error.response?.data);
    } else {
      toast.error('Unknown Payment Error:');
    }
  }
};

export const sendOTPFunction = async (email: string,) => {
  try {

    if (email) {
      const res = await api.get(`users/send-otp?email=${email}`);
      const { data } = res.data;

      if (res.data.success) {
        toast.success("Otp send successfully")
        return data.otp
      }
    }

  } catch (error) {
    console.log("Failed in OTP send", error);
    toast.error("Failed in OTP send");

  }
}

export const verifyOTPFUnction = async (email: string, otp: string) => {
  try {

    if (email && otp) {
      const res = await api.post(`users/verify-otp`, {
        email,
        otp,
      });
      const { data } = res.data;
      console.log("data:=", data);


      if (data.verified) {
        toast.success("Otp verify successfully")
        return data.verified
      }
    }

  } catch (error: unknown) {
    console.log("Failed in OTP send", error);

    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.details);
    } else {
      toast.error("An unexpected error occurred");
    }
  }
}

export const triggerDownload = (url: string, filename: string) => {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank"
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  fetch(url)
    .then(response => {
      console.log(response);

      if (!response.ok) throw new Error('Network response was not ok');
      return response.blob();
    })
    .then(blob => {
      saveAs(blob, filename);
    })
    .catch(error => {
      console.error('Download error:', error);
    });
};

export const handleComplementaryAddToCart = async (product: IProductData, userId: string) => {
  try {
    const response = await addToCart(product, 1, userId)
    if (response) {
      toast.success(`${product.name} added to cart`)
    }
  } catch (error) {
    console.error("Error adding complementary product to cart:", error)
    toast.error("Failed to add product to cart")
  }
}