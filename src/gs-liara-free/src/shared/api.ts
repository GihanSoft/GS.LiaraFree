const unauthorizedListeners = new Set<() => void>();

/**
 * Registers a callback to be invoked when a 401 response is received.
 * @returns A function to unsubscribe the callback.
 */
export const onUnauthorized = (callback: () => void) => {
  unauthorizedListeners.add(callback);
  return () => unauthorizedListeners.delete(callback);
};

let isProcessingUnauthorized = false;

const handleUnauthorized = () => {
  if (isProcessingUnauthorized) {
    return;
  }

  isProcessingUnauthorized = true;
  try {
    if (unauthorizedListeners.size === 0) {
      console.warn("Unauthorized (401) and no handlers registered.");
    }

    unauthorizedListeners.forEach((callback) => {
      try {
        callback();
      } catch (err) {
        console.error("Unauthorized callback failed:", err);
      }
    });
  } finally {
    isProcessingUnauthorized = false;
  }
};

const api = async (
  url: string | URL | globalThis.Request,
  init?: RequestInit
) => {
  const response = await fetch(url, init);
  if (response.status === 401) {
    handleUnauthorized();
  }

  return response;
};

export default api;
