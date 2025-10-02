"use client";
import { useEffect, useState } from "react";

export interface User {
  id: number;
  email: string;
  full_name?: string;
  phone?: string;
  address?: string;
  image?: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setUser(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { user, loading };
}
