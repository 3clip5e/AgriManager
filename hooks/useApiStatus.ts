"use client";
import { useState } from "react";
import { toast } from "sonner";

export function useApiStatus() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const run = async <T>(
    asyncFunc: () => Promise<T>,
    options?: { successMsg?: string; errorMsg?: string; isSaving?: boolean }
  ): Promise<T> => {
    try {
      if (options?.isSaving) setSaving(true);
      else setLoading(true);

      const result = await asyncFunc();

      if (options?.successMsg) toast.success(options.successMsg);
      return result;
    } catch (error) {
      toast.error(options?.errorMsg || "Une erreur est survenue ❌");
      throw error;
    } finally {
      if (options?.isSaving) setSaving(false);
      else setLoading(false);
    }
  };

  return { loading, saving, run };
}
