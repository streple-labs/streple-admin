/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import api from "./server-axios";

export const getSession = async (): Promise<{
  success: boolean;
  message: string;
  user_data: User | null;
}> => {
  try {
    const res = await api.get("/users/me");

    return {
      success: true,
      message: "",
      user_data: res.data,
    };
  } catch (error: any) {
    let errorMessage = "request failed. Please try again later.";

    if (error?.response?.data?.message) {
      if (Array.isArray(error.response.data.message))
        errorMessage = error.response.data.message.join(", ");
      else errorMessage = error.response.data.message;
    } else if (error?.userMessage) errorMessage = error.userMessage;
    else if (error?.message) errorMessage = error.message;

    return { success: false, message: errorMessage, user_data: null };
  }
};

export const getAllUsers = async (): Promise<{
  success: boolean;
  message: string;
  users: { data: User[]; totalCount: number; totalPages: number } | null;
}> => {
  try {
    const res = await api.get("/users/manage-user");

    return {
      success: true,
      message: "",
      users: res.data,
    };
  } catch (error: any) {
    let errorMessage = "request failed. Please try again later.";

    if (error?.response?.data?.message) {
      if (Array.isArray(error.response.data.message))
        errorMessage = error.response.data.message.join(", ");
      else errorMessage = error.response.data.message;
    } else if (error?.userMessage) errorMessage = error.userMessage;
    else if (error?.message) errorMessage = error.message;

    return { success: false, message: errorMessage, users: null };
  }
};

export const getUserCopyTrades = async (params: {
  limit?: number;
  page?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  status?: string;
  outcome?: string;
  search?: string;
  draft?: boolean;
  action?: string;
  asset?: string;
  fromDate?: string;
  toDate?: string;
  copiers?: string;
}): Promise<{ trades: GetCopyTradesResponse | null; error: string | null }> => {
  try {
    const res = await api.get("/user-trades", { params });

    return { trades: res.data, error: null };
  } catch (error: any) {
    let errorMessage = "request failed. Please try again later.";
    if (error?.response?.data?.message) {
      if (Array.isArray(error.response.data.message))
        errorMessage = error.response.data.message.join(", ");
      else errorMessage = error.response.data.message;
    } else if (error?.userMessage) errorMessage = error.userMessage;
    else if (error?.message) errorMessage = error.message;
    return {
      error: errorMessage,
      trades: null,
    };
  }
};

export const getUserCopyTradeStats = async (): Promise<{
  stats: GetCopyTradeStatsResponse | null;
  error: string | null;
}> => {
  try {
    const res = await api.get("/trading-stats");

    return { stats: res.data, error: null };
  } catch (error: any) {
    let errorMessage = "request failed. Please try again later.";
    if (error?.response?.data?.message) {
      if (Array.isArray(error.response.data.message))
        errorMessage = error.response.data.message.join(", ");
      else errorMessage = error.response.data.message;
    } else if (error?.userMessage) errorMessage = error.userMessage;
    else if (error?.message) errorMessage = error.message;
    return {
      error: errorMessage,
      stats: null,
    };
  }
};

export const clearToken = async () => {
  (await cookies()).delete("streple_auth_token");
  (await cookies()).delete("streple_refresh_token");

  redirect("/login");
};
