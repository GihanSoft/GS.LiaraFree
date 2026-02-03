import api from "../../../shared/api";
import { failure, success, type Result } from "../../../shared/result";

const API_ENDPOINTS = {
  SETUP: "/api/admin/ownership",
};

export const claimAdminRole: () => Promise<Result> = async () => {
  try {
    const resp = await api(API_ENDPOINTS.SETUP, {
      method: "POST",
    });

    if (!resp.ok) {
      if (resp.status === 403) {
        return failure({
          type: "",
          title: "This instance already has admins. This will be reported.",
          status: 403,
        });
      }

      return failure({
        type: "",
        title: `HTTP error! status: ${resp.status}`,
        status: resp.status,
      });
    }

    return success(undefined);
  } catch (err) {
    return err instanceof Error
      ? failure({ type: "", title: err.message, status: 500 })
      : failure({ type: "", title: "An unknown error occurred", status: 500 });
  }
};
