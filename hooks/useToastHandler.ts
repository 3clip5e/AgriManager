"use client";

import { toast } from "sonner";

export function useToastHandler() {
  const showSuccess = (message: string, duration = 4000) => {
    toast.success(message, { duration });
  };

  const showError = (message: string, duration = 4000) => {
    toast.error(message, { duration });
  };

  const showMessage = (message: string, duration = 4000) => {
    toast(message, { duration });
  };

  return { showSuccess, showError, showMessage };
}
