/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import api from "./axios";
import { redirect } from "next/navigation";

export const getLoggedInUser = async () => {
  try {
    const res = await api.get("/users/me");

    return {
      success: true,
      message: "",
      user_data: res.data.data,
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

export const clearToken = async () => {
  (await cookies()).delete("streple_auth_token");
  redirect("/login");
};
