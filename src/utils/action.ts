/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import api from "./server-axios";

export const login = async (formData: { email: string; password: string }) => {
  try {
    const res = await api.post("/auth/login/admin", formData);

    const {
      streple_auth_token,
      streple_refresh_token,
      data: user_data,
    } = res.data;

    (await cookies()).set("streple_auth_token", streple_auth_token, {
      // httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 60 * 60 * 1000),
      path: "/",
    });

    (await cookies()).set("streple_refresh_token", streple_refresh_token, {
      // httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
      path: "/",
    });

    return {
      success: true,
      message: "Login successful.",
      user_data,
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

export const forgotPassword = async (email: string) => {
  try {
    const res = await api.post("/auth/forgot-password", {
      email,
    });

    return {
      success: true,
      message: res.data.message,
    };
  } catch (error: any) {
    let errorMessage = "forgot password failed. Please try again later.";

    if (error?.response?.data?.message) {
      if (Array.isArray(error.response.data.message))
        errorMessage = error.response.data.message.join(", ");
      else errorMessage = error.response.data.message;
    } else if (error?.userMessage) errorMessage = error.userMessage;
    else if (error?.message) errorMessage = error.message;

    return { success: false, message: errorMessage };
  }
};

export const resetPassword = async (formData: {
  email: string;
  password: string;
}) => {
  try {
    const res = await api.post("/auth/reset-password", {
      newPassword: formData.password,
      email: formData.email,
    });

    return {
      success: true,
      message: res.data.message,
    };
  } catch (error: any) {
    let errorMessage = "password reset failed. Please try again later.";

    if (error?.response?.data?.message) {
      if (Array.isArray(error.response.data.message))
        errorMessage = error.response.data.message.join(", ");
      else errorMessage = error.response.data.message;
    } else if (error?.userMessage) errorMessage = error.userMessage;
    else if (error?.message) errorMessage = error.message;

    return { success: false, message: errorMessage };
  }
};

export const verifyOtp = async (
  formData: { otp: string; email: string },
  purpose: "verify" | "reset"
) => {
  try {
    const res = await api.post(
      `/auth/verify-${purpose === "reset" ? "otp" : "email"}`,
      formData
    );

    return {
      success: true,
      message: res.data.message,
    };
  } catch (error: any) {
    let errorMessage = "OTP Verification failed. Please try again later.";

    if (error?.response?.data?.message) {
      if (Array.isArray(error.response.data.message))
        errorMessage = error.response.data.message.join(", ");
      else errorMessage = error.response.data.message;
    } else if (error?.userMessage) errorMessage = error.userMessage;
    else if (error?.message) errorMessage = error.message;

    return { success: false, message: errorMessage };
  }
};

export const resendOtp = async (formData: {
  email: string;
  purpose: "verify" | "reset";
}) => {
  try {
    const res = await api.post("/auth/resend-otp", formData);

    return {
      success: true,
      message: res.data.message,
    };
  } catch (error: any) {
    let errorMessage = "Resend OTP failed. Please try again later.";

    if (error?.response?.data?.message) {
      if (Array.isArray(error.response.data.message))
        errorMessage = error.response.data.message.join(", ");
      else errorMessage = error.response.data.message;
    } else if (error?.userMessage) errorMessage = error.userMessage;
    else if (error?.message) errorMessage = error.message;

    return { success: false, message: errorMessage };
  }
};

export const publishTrade = async (formData: CopyTradeFormData) => {
  try {
    const res = await api.post("/trade", formData);

    return {
      success: true,
      message: "Trade created successfully.",
      trade: res.data,
    };
  } catch (error: any) {
    let errorMessage = "Create trade failed. Please try again later.";

    if (error?.response?.data?.message) {
      if (Array.isArray(error.response.data.message))
        errorMessage = error.response.data.message.join(", ");
      else errorMessage = error.response.data.message;
    } else if (error?.userMessage) errorMessage = error.userMessage;
    else if (error?.message) errorMessage = error.message;

    return { success: false, message: errorMessage, trade: null };
  }
};
