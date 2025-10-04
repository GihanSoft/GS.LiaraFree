import type { ProblemDetails } from "../../../shared/problem-details";

const API_ENDPOINTS = {
  LOGIN: "/api/auth/login?useCookies=true",
};

export const FORM_FIELDS = {
  EMAIL: "email",
  PASSWORD: "password",
};

export interface FormState {
  email?: string;
  errors: {
    formErrors: string[];
  };
  succeed: boolean;
}

export const initialState: FormState = {
  errors: { formErrors: [] },
  succeed: false,
};

/**
 * Handles the user login form submission.
 * This is a self-contained action that does not depend on React hooks.
 *
 * @param _previousState - The previous state of the form.
 * @param formData - The FormData object from the form submission.
 * @returns The new state of the form.
 */
export const handleAction = async (
  _previousState: FormState,
  formData: FormData
): Promise<FormState> => {
  const email = formData.get(FORM_FIELDS.EMAIL)?.toString();
  const password = formData.get(FORM_FIELDS.PASSWORD)?.toString();

  if (!email || !password) {
    return {
      ...initialState,
      email,
      errors: { formErrors: ["Email and Password cannot be empty."] },
    };
  }

  const baseErrorState = { ...initialState, email };

  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      return { ...initialState, succeed: true };
    }

    if (response.status === 401 || response.status === 400) {
      if (
        response.headers
          .get("Content-Type")
          ?.includes("application/problem+json")
      ) {
        const body: ProblemDetails = await response.json();
        const detailError = body.detail ?? body.title;
        if (detailError) {
          return { ...baseErrorState, errors: { formErrors: [detailError] } };
        }
      }

      return {
        ...baseErrorState,
        errors: { formErrors: ["Invalid email or password."] },
      };
    }

    return {
      ...baseErrorState,
      errors: {
        formErrors: ["An unexpected error occurred. Please try again."],
      },
    };
  } catch (error) {
    console.error("Login failed:", error);
    return {
      ...baseErrorState,
      errors: {
        formErrors: [
          "Could not connect to the server. Please check your network.",
        ],
      },
    };
  }
};
