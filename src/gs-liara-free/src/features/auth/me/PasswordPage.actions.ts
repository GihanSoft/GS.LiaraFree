import type { ProblemDetails } from "../../../shared/problem-details";

const API_ENDPOINTS = {
  INFO: "/api/auth/manage/info",
};

export const FORM_FIELDS = {
  OLD_PASSWORD: "newPassword",
  NEW_PASSWORD: "oldPassword",
};

export interface FormState {
  errors: {
    formErrors: string[];
  };
  succeed: boolean;
}

export const initialState: FormState = {
  errors: { formErrors: [] },
  succeed: false,
};

export const handleAction = async (
  _previousState: FormState,
  formData: FormData
): Promise<FormState> => {
  const oldPassword = formData.get(FORM_FIELDS.OLD_PASSWORD)?.toString();
  const newPassword = formData.get(FORM_FIELDS.NEW_PASSWORD)?.toString();

  if (!oldPassword || !newPassword) {
    return {
      ...initialState,
      errors: { formErrors: ["old and new passwords can't be empty."] },
    };
  }

  const baseErrorState = { ...initialState };

  try {
    const response = await fetch(API_ENDPOINTS.INFO, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldPassword, newPassword }),
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
        errors: { formErrors: ["Invalid password."] },
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