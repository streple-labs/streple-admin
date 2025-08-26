import { AxiosError, InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
}

export function formatCurrency(value: number, showCurrency: boolean = true) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  if (!showCurrency)
    return `${sign}${Math.abs(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  return `${sign}$${Math.abs(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function createNetworkError(
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

export const passwordValidation = (password: string) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  let message = "";

  if (!checks.length) message = "At least 8 characters";
  else if (!checks.uppercase) message = "At least one uppercase letter";
  else if (!checks.lowercase) message = "At least one lowercase letter";
  else if (!checks.number) message = "At least one number";
  else if (!checks.special) message = "At least one special character";
  else message = "All requirements met";

  const passedChecks = Object.values(checks).filter(Boolean).length;

  return {
    message,
    passedChecks,
  };
};

export const focusToNextInput = (target: HTMLElement) => {
  const nextElementSibling = target.nextElementSibling as HTMLInputElement;

  if (nextElementSibling) nextElementSibling.focus();
};
export const focusToPrevInput = (target: HTMLElement) => {
  const previousElementSibling =
    target.previousElementSibling as HTMLInputElement;

  if (previousElementSibling) previousElementSibling.focus();
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
