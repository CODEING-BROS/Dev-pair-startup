// src/hooks/useGetAllPosts.js
import { useEffect } from "react";
import axios from "axios";
import usePostStore from "@/store/postStore"; // ✅ Updated to use Zustand store

const useGetAllPosts = () => {
  const setPosts = usePostStore((state) => state.setPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/post/all", {
          withCredentials: true,
        });

        // ✅ Call the Zustand store action directly
        setPosts(res.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [setPosts]);
};

export default useGetAllPosts;