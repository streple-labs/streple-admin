/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import api from "./axios";

export const login = async (formData: { email: string; password: string }) => {
  try {
    const res = await api.post("/auth/login", formData);

    (await cookies()).set("streple_auth_token", res.data.streple_auth_token, {
      // httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 60 * 60 * 1000),
      path: "/",
    });

    return {
      success: true,
      message: "Login successful.",
      user_data: res.data.data,
    };
  } catch (error: any) {
    let errorMessage = "login failed. Please try again later.";

    if (error?.response?.data?.message) {
      if (Array.isArray(error.response.data.message))
        errorMessage = error.response.data.message.join(", ");
      else errorMessage = error.response.data.message;
    } else if (error?.userMessage) errorMessage = error.userMessage;
    else if (error?.message) errorMessage = error.message;

    return { success: false, message: errorMessage, user_data: null };
  }
};
