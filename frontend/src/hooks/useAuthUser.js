import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "@/store/authStore";

const useAuthUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user: authUser, setAuthUser } = useAuthStore();

  useEffect(() => {
    if (authUser) {
      setIsLoading(false);
      return;
    }

    const fetchAuthUser = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5173';
        const res = await axios.get(`${BASE_URL}/auth/me`, {
          withCredentials: true,
        });
        if (res.data && res.data.user) { 
          setAuthUser(res.data.user);
        }
      } catch (error) {
        console.error("Error fetching authenticated user:", error);
        setAuthUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthUser();
  }, [setAuthUser, authUser]);

  return { isLoading, authUser };
};

export default useAuthUser; // ✅ The corrected line for default export