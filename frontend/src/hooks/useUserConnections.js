// src/hooks/useUserConnections.js
import { useEffect, useState } from "react";
import axios from "axios";

export const useUserConnections = (username) => {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:4000/user/profile/${username}/connections`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setFollowers(res.data.followers || []);
          setFollowing(res.data.following || []);
        }
      } catch (err) {
        console.error("Failed to fetch connections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  return { followers, following, loading };
};