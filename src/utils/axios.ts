import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import { base_url } from "./constants";
import { createNetworkError } from "./utils";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
}

const api = axios.create({
  baseURL: base_url,
  timeout: 20000,
});

api.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = getCookie("streple_auth_token");
    if (token && config.headers)
      config.headers["Authorization"] = `Bearer ${token}`;

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

    if (process.env.NODE_ENV === "development")
      console.log("✅ Response:", {
        status: response.status,
        url: response.config.url,
        duration: `${duration}ms`,
        data: response.data,
      });

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

      if (response.status === 401 && typeof window !== "undefined") {
        deleteCookie("streple_auth_token");
        window.location.href = "/login";
      }
    } else if (request) {
      console.error("🌐 Network Error:", {
        message: "No response received",
        url: config?.url,
        duration: `${duration}ms`,
      });
      const networkError = createNetworkError(error, config, duration);
      return Promise.reject(networkError);
    } else console.error("⚙️ Request Setup Error:", error.message);

    return Promise.reject(error);
  }
);

export default api;
