import type { ProblemDetails } from "../../../shared/problem-details";

const API_ENDPOINTS = {
  REGISTER: "/api/auth/register",
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
  email: undefined,
  errors: { formErrors: [] },
  succeed: false,
};

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
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      return { ...initialState, succeed: true };
    }

    if (
      response.headers.get("Content-Type")?.includes("application/problem+json")
    ) {
      const body: ProblemDetails = await response.json();
      if (body.errors) {
        const errors = Object.values(body.errors).flat();
        return { ...baseErrorState, errors: { formErrors: errors } };
      }

      const detailError =
        body.detail ?? body.title ?? "An unknown error occurred.";
      return { ...baseErrorState, errors: { formErrors: [detailError] } };
    }

    return {
      ...baseErrorState,
      errors: {
        formErrors: ["An unexpected error occurred. Please try again."],
      },
    };
  } catch (error) {
    console.error("Registration failed:", error);
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
