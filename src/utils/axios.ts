import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import { base_url } from "./constants";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
}

const api = axios.create({
  baseURL: base_url,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = getCookie("streple_auth_token");
      if (token && config.headers)
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    config.metadata = { startTime: new Date() };

    if (process.env.NODE_ENV === "development") {
      console.log("🚀 Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        headers: config.headers,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request setup error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as CustomAxiosRequestConfig;

    const endTime = new Date();
    const duration = config?.metadata?.startTime
      ? endTime.getTime() - config.metadata.startTime.getTime()
      : 0;

    if (process.env.NODE_ENV === "development") {
      console.log("✅ Response:", {
        status: response.status,
        url: response.config.url,
        duration: `${duration}ms`,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError) => {
    const { response, request } = error;

    const config = error.config as CustomAxiosRequestConfig;
    const duration = config?.metadata
      ? new Date().getTime() - config.metadata.startTime.getTime()
      : 0;

    if (response) {
      const errorInfo = {
        status: response.status,
        statusText: response.statusText,
        url: config?.url,
        duration: `${duration}ms`,
        data: response.data,
      };

      console.error("🔥 Response Error:", errorInfo);

      if (response.status === 401)
        if (typeof window !== "undefined") {
          deleteCookie("streple_auth_token");
          // window.location.href = "/login"; // Uncomment to redirect
        }
    } else if (request) {
      console.error("🌐 Network Error:", {
        message: "No response received",
        url: config?.url,
        duration: `${duration}ms`,
      });
      const networkError = createNetworkError(error, config, duration);
      return Promise.reject(networkError);
    } else {
      console.error("⚙️ Request Setup Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

function createNetworkError(
  error: AxiosError,
  config: CustomAxiosRequestConfig,
  duration: number
) {
  const baseError = {
    type: "NETWORK_ERROR",
    timestamp: new Date().toISOString(),
    url: config?.url,
    method: config?.method?.toUpperCase(),
    duration: `${duration}ms`,
  };

  // Determine specific network error type
  if (error.code === "ECONNABORTED") {
    return {
      ...baseError,
      subType: "TIMEOUT",
      message:
        "The request timed out. Please check your internet connection and try again.",
      userMessage: "Request timed out. Please try again.",
      code: "TIMEOUT_ERROR",
    };
  }

  if (error.code === "ENOTFOUND" || error.code === "EAI_AGAIN") {
    return {
      ...baseError,
      subType: "DNS_ERROR",
      message:
        "Unable to resolve the server address. Please check your internet connection.",
      userMessage:
        "Cannot connect to server. Please check your internet connection.",
      code: "DNS_RESOLUTION_ERROR",
    };
  }

  if (error.code === "ECONNREFUSED") {
    return {
      ...baseError,
      subType: "CONNECTION_REFUSED",
      message:
        "The server refused the connection. The service might be temporarily unavailable.",
      userMessage: "Service temporarily unavailable. Please try again later.",
      code: "CONNECTION_REFUSED_ERROR",
    };
  }

  if (error.code === "ECONNRESET") {
    return {
      ...baseError,
      subType: "CONNECTION_RESET",
      message:
        "The connection was reset by the server. This might be a temporary issue.",
      userMessage: "Connection interrupted. Please try again.",
      code: "CONNECTION_RESET_ERROR",
    };
  }

  if (error.code === "EHOSTUNREACH") {
    return {
      ...baseError,
      subType: "HOST_UNREACHABLE",
      message:
        "The server is unreachable. Please check your network connection.",
      userMessage: "Cannot reach server. Please check your connection.",
      code: "HOST_UNREACHABLE_ERROR",
    };
  }

  if (error.code === "ENETUNREACH") {
    return {
      ...baseError,
      subType: "NETWORK_UNREACHABLE",
      message: "Network is unreachable. Please check your internet connection.",
      userMessage: "No internet connection. Please check your network.",
      code: "NETWORK_UNREACHABLE_ERROR",
    };
  }

  // Generic network error for unknown cases
  return {
    ...baseError,
    subType: "UNKNOWN_NETWORK_ERROR",
    message:
      "A network error occurred. Please check your internet connection and try again.",
    userMessage: "Connection failed. Please try again.",
    code: "UNKNOWN_NETWORK_ERROR",
    originalError: error.message,
  };
}
