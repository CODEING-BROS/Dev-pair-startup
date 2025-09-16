// src/hooks/useGetUserProfile.js
import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "@/store/authStore"; // ✅ Updated to use Zustand store

export default function useGetUserProfile(username) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const setUserProfile = useAuthStore((state) => state.setUserProfile);
  const userprofile = useAuthStore((state) => state.userprofile);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const url = username
          ? `http://localhost:4000/user/profile/${username}`
          : `http://localhost:4000/user/profile`;

        const res = await axios.get(url, { withCredentials: true });
        // ✅ Set the fetched profile in the Zustand store
        setUserProfile(res.data.user);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err?.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, setUserProfile]);

  return { data: userprofile, loading, error };
}