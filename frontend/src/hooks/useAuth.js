import { useEffect, useState } from "react";
import { me } from "../api/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const data = await me();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return { user, setUser, loading, refresh, logout };
}

