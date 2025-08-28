import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { base_url } from "./constants";
import { createNetworkError } from "./utils";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
  _retry?: boolean;
}

const api = axios.create({
  baseURL: base_url,
  timeout: 20000,
});

let isRefreshing = false;
let failedRequestsQueue: ((token: string) => void)[] = [];

api.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    const token = (await cookies()).get("streple_auth_token")?.value;

    if (token && config.headers)
      config.headers["Authorization"] = `Bearer ${token}`;

    config.metadata = { startTime: new Date() };

    if (process.env.NODE_ENV === "development")
      console.log("🚀 Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        headers: config.headers,
      });

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
  async (error: AxiosError) => {
    const { response, request, config } = error;

    const originalRequest = config as CustomAxiosRequestConfig;
    const duration = originalRequest.metadata
      ? new Date().getTime() - originalRequest.metadata.startTime.getTime()
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

      if (response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (!isRefreshing) {
          isRefreshing = true;
          if (process.env.NODE_ENV === "development")
            console.log("Attempting to refresh access token...");
          try {
            const refreshToken = (await cookies()).get(
              "streple_refresh_token"
            )?.value;

            if (!refreshToken) {
              (await cookies()).delete("streple_auth_token");
              (await cookies()).delete("streple_refresh_token");
              return redirect("/login");
            }

            const refreshResponse = await axios.post(
              `${base_url}/auth/refresh`,
              {
                token: refreshToken,
              }
            );

            const { streple_auth_token: newAccessToken } = refreshResponse.data;

            (await cookies()).set("streple_auth_token", newAccessToken, {
              // httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              expires: new Date(Date.now() + 60 * 60 * 1000),
              path: "/",
            });

            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;

            // Re-run all the requests that were queued up
            failedRequestsQueue.forEach((callback) => callback(newAccessToken));
            failedRequestsQueue = []; // Clear the queue

            isRefreshing = false;

            // Re-try the original failed request with the new token
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return api(originalRequest);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (refreshError: any) {
            console.error("❌ Token refresh failed:", refreshError);

            failedRequestsQueue = [];
            isRefreshing = false;

            (await cookies()).delete("streple_auth_token");
            (await cookies()).delete("streple_refresh_token");
            return redirect("/login");
          }
        }

        // If a refresh is already in progress, add the failed request to a queue
        return new Promise((resolve) => {
          failedRequestsQueue.push((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }
    } else if (request) {
      console.error("🌐 Network Error:", {
        message: "No response received",
        url: config?.url,
        duration: `${duration}ms`,
      });
      const networkError = createNetworkError(error, originalRequest, duration);
      return Promise.reject(networkError);
    } else console.error("⚙️ Request Setup Error:", error.message);

    return Promise.reject(error);
  }
);

export default api;
