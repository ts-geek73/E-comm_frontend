import { FetchParams, PromoCode } from "@types";
import axios, { AxiosError } from "axios";
import api from "@/lib/axios";
import { toast } from "react-toastify";

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

export const deletePromo = async (_id: string, userId: string): Promise<void> => {
  if (userId && _id) {
    try {
      await api.delete(`/promocode/${_id}`, {
        params: { user_id: userId },
      });

      toast.success("delete success")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Unexpected Error:");
      }
      throw error;
    }
  }
};

export const savePromo = async (promo: PromoCode, userId: string): Promise<void> => {
  if (userId) {
    try {
      if (promo._id) {
        await api.put(`/promocode/${promo._id}`, promo, {
          params: { user_id: userId },
        });
        toast.success("Promocode Update")
      } else {
        await api.post('/promocode', promo, {
          params: { user_id: userId },
        });
        toast.success("Promocode Create")
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.medssage);
      } else {
        toast.error("Unexpected Error:");
      }
      throw error;
    }
  }
};
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
