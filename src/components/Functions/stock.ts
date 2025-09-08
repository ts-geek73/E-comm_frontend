import apiServer from "@/lib/axios";
import { IStockEntry } from "@types";
import { AxiosError } from "axios";
import { toast } from "react-toastify";


export const addStockEntry = async (
  payload: IStockEntry,
  userId: string
) => {
  try {
    const res = await apiServer.post("/stock", {
      ...payload,
      user_id: userId,
    });

    const { success, message } = res.data;
    if (success) {
      toast.success(message);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message);
    } else {
      toast.error("Failed to add stock entry.");
    }
  }
};

export const fetchStockEntries = async (
  sortField = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
) => {
  try {
    const { data } = await apiServer.get("/stock", {
      params: { sortField, sortOrder },
    });

    return data.data;
  } catch (error) {
    console.error("Fetch stock error:", error);
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message);
    } else {
      toast.error("Failed to fetch stock entries.");
    }
  }
};

export const updateStockEntry = async (id: string, payload: IStockEntry) => {
  try {
    const res = await apiServer.put(`/stock/${id}`, payload);
    const { success, message } = res.data;
    if (success) {
      toast.success(message);
    }
  } catch (error) {
    console.log("🚀 ~ updateStockEntry ~ error:", error)
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message);
    } else {
      toast.error("Failed to update stock entry.");
    }
  }
};

export const deleteStockEntry = async (id: string) => {
  console.log("🚀 ~ deleteStockEntry ~ id:", id)
  try {
    const res = await apiServer.delete(`/stock/${id}`);
    console.log("🚀 ~ deleteStockEntry ~ res:", res)
    const { success, message } = res.data;
    if (success) {
      toast.success(message);
    }
  } catch (error) {
    console.log("🚀 ~ deleteStockEntry ~ error:", error)
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message);
    } else {
      toast.error("Failed to delete stock entry.");
    }
  }
};
