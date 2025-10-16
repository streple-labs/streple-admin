import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
}

export const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatFigure = (num: number) => {
  if (num === null || num === undefined || isNaN(num)) return "0.00";
  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (absNum < 1_000_000)
    return (
      sign +
      absNum.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  else
    return (
      sign +
      (absNum / 1_000_000).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) +
      "M"
    );
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

/**
 * Compresses and optionally resizes an image file until its size is less than
 * or equal to the target size in Kilobytes (KB).
 *
 * @param {File} imageFile - The image file (e.g., from an <input type="file">).
 * @param {number} targetSizeInKB - The maximum desired size of the compressed image in Kilobytes (KB).
 * @param {number} [initialQuality=0.9] - The starting JPEG compression quality (0.0 to 1.0).
 * @param {number} [qualityStep=0.05] - How much to decrease quality in each compression attempt.
 * @param {number} [minQuality=0.1] - The minimum quality to stop at before attempting resizing.
 * @returns {Promise<File>} A Promise that resolves with the compressed image as a new File object.
 */
export function compressImageToTargetSize(
  imageFile: File,
  targetSizeInKB: number,
  initialQuality: number = 0.9,
  qualityStep: number = 0.05,
  minQuality: number = 0.1
): Promise<File> {
  const targetSizeInBytes: number = targetSizeInKB * 1024;

  if (imageFile.size <= targetSizeInBytes) {
    console.log(`Image is already below ${targetSizeInKB} KB.`);
    return Promise.resolve(imageFile);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const img = new Image();

      img.onload = () => {
        let currentQuality: number = initialQuality;
        let currentWidth: number = img.width;
        let currentHeight: number = img.height;

        const mimeType: string =
          imageFile.type === "image/jpeg" || imageFile.type === "image/png"
            ? "image/jpeg"
            : imageFile.type;

        let bestEffortBlob: Blob | null = null;

        const attemptCompression = (isResizing: boolean = false): void => {
          const canvas: HTMLCanvasElement = document.createElement("canvas");
          canvas.width = currentWidth;
          canvas.height = currentHeight;
          const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

          if (!ctx) {
            return reject(new Error("Failed to get 2D canvas context."));
          }

          ctx.drawImage(img, 0, 0, currentWidth, currentHeight);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return reject(
                  new Error("Failed to create Blob during compression.")
                );
              }

              bestEffortBlob = blob;

              if (blob.size <= targetSizeInBytes) {
                const compressedFile: File = new File([blob], imageFile.name, {
                  type: mimeType,
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
                return;
              }

              currentQuality -= qualityStep;

              if (currentQuality < minQuality) {
                if (isResizing) {
                  const finalFile: File = new File(
                    [bestEffortBlob],
                    imageFile.name,
                    { type: mimeType }
                  );
                  resolve(finalFile);
                  return;
                }

                currentWidth = Math.floor(currentWidth * 0.9);
                currentHeight = Math.floor(currentHeight * 0.9);
                currentQuality = initialQuality;

                if (currentWidth < 100 || currentHeight < 100) {
                  const finalFile: File = new File(
                    [bestEffortBlob],
                    imageFile.name,
                    { type: mimeType }
                  );
                  resolve(finalFile);
                  return;
                }

                attemptCompression(true);
                return;
              }

              attemptCompression(isResizing);
            },
            mimeType,
            currentQuality
          );
        };

        attemptCompression(false);
      };

      img.onerror = () =>
        reject(new Error("Failed to load image for processing."));

      if (typeof event.target?.result === "string")
        img.src = event.target.result;
      else reject(new Error("Failed to read file as Data URL."));
    };

    reader.onerror = () => reject(new Error("Failed to read the file."));

    reader.readAsDataURL(imageFile);
  });
}
