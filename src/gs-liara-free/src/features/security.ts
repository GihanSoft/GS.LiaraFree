import * as localforage from "localforage";

export const secureFetch = (
  input: string | URL | globalThis.Request,
  init?: RequestInit
): Promise<Response> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get tokens from localStorage
      const tokenType = localStorage.getItem("tokenType") || "Bearer";
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const tokenExpiration = localStorage.getItem("tokenExpiration");

      // Check if we have a token and if it's expired
      const isTokenExpired = tokenExpiration
        ? new Date().getTime() > parseInt(tokenExpiration)
        : true;

      // If token is expired and we have a refresh token, try to refresh
      if (isTokenExpired && refreshToken) {
        try {
          const refreshResponse = await fetch("/api/security/refresh", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const data = await refreshResponse.json();

            // Update stored tokens
            localStorage.setItem("tokenType", data.tokenType || "Bearer");
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            // Calculate new expiration time
            const expirationTime = new Date().getTime() + data.expiresIn * 1000;
            localStorage.setItem("tokenExpiration", expirationTime.toString());

            // Update the access token for the current request
            const newAccessToken = data.accessToken;
            const newTokenType = data.tokenType || "Bearer";

            // Prepare the request with the new token
            const secureInit: RequestInit = {
              ...init,
              headers: {
                ...init?.headers,
                Authorization: `${newTokenType} ${newAccessToken}`,
              },
            };

            // Make the original request with the new token
            const response = await fetch(input, secureInit);
            resolve(response);
            return;
          } else {
            // If refresh fails, clear tokens and reject
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("tokenType");
            localStorage.removeItem("tokenExpiration");

            // Redirect to login page
            window.location.href = "/login";
            reject(new Error("Session expired. Please login again."));
            return;
          }
        } catch (refreshError) {
          // If refresh request fails, clear tokens and reject
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("tokenType");
          localStorage.removeItem("tokenExpiration");

          // Redirect to login page
          window.location.href = "/login";
          reject(new Error("Failed to refresh token. Please login again."));
          return;
        }
      }

      // If we don't have a token or it's expired and we can't refresh, make the request without auth
      if (!accessToken || isTokenExpired) {
        const response = await fetch(input, init);
        resolve(response);
        return;
      }

      // Prepare the request with the authorization header
      const secureInit: RequestInit = {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `${tokenType} ${accessToken}`,
        },
      };

      // Make the request
      const response = await fetch(input, secureInit);

      // If we get a 401 Unauthorized, try to refresh the token and retry
      if (response.status === 401 && refreshToken) {
        try {
          const refreshResponse = await fetch("/api/security/refresh", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const data = await refreshResponse.json();

            // Update stored tokens
            localStorage.setItem("tokenType", data.tokenType || "Bearer");
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            // Calculate new expiration time
            const expirationTime = new Date().getTime() + data.expiresIn * 1000;
            localStorage.setItem("tokenExpiration", expirationTime.toString());

            // Retry the original request with the new token
            const retryInit: RequestInit = {
              ...init,
              headers: {
                ...init?.headers,
                Authorization: `${data.tokenType || "Bearer"} ${
                  data.accessToken
                }`,
              },
            };

            const retryResponse = await fetch(input, retryInit);
            resolve(retryResponse);
            return;
          } else {
            // If refresh fails, clear tokens and reject
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("tokenType");
            localStorage.removeItem("tokenExpiration");

            // Redirect to login page
            window.location.href = "/login";
            reject(new Error("Session expired. Please login again."));
            return;
          }
        } catch (refreshError) {
          // If refresh request fails, clear tokens and reject
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("tokenType");
          localStorage.removeItem("tokenExpiration");

          // Redirect to login page
          window.location.href = "/login";
          reject(new Error("Failed to refresh token. Please login again."));
          return;
        }
      }

      // Resolve with the original response
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

export const register = (email: string, password: string) =>
  fetch("/api/security/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch("/api/security/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Login failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();

    // Validate the response structure
    if (
      !result.tokenType ||
      !result.accessToken ||
      !result.refreshToken ||
      !result.expiresIn
    ) {
      throw new Error("Invalid authentication response from server");
    }

    // Calculate expiration timestamp
    const expiresAt = new Date().getTime() + result.expiresIn * 1000;

    // Create a complete auth object
    const authData = {
      tokenType: result.tokenType,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresAt
    };

    // Store tokens in localforage
    await localforage.setItem("auth-tokens", authData);

    return authData;
  } catch (error) {
    console.error("Login error:", error);
    // Clear any existing tokens on login failure
    await localforage.removeItem("auth-tokens");
    localStorage.removeItem("auth-tokens");
    throw error; // Re-throw to let the caller handle
  }
};
