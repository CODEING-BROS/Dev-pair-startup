// src/hooks/useGetUserPosts.js
import { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "@/store/authStore"; // ✅ Updated to use Zustand store

const useGetUserPosts = (usernameFromProp) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get user from Zustand store
  const user = useAuthStore((state) => state.user);
  const userLoading = !user && !usernameFromProp;
  const username = usernameFromProp || user?.username;

  useEffect(() => {
    if (!username || userLoading) {
      if (!username) setLoading(false);
      return;
    }

    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/post/user/${username}`, {
          withCredentials: true,
        });
        setPosts(res.data.posts);
      } catch (error) {
        console.error("Failed to fetch user posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [username, userLoading]);

  return { posts, loading };
};

export default useGetUserPosts;