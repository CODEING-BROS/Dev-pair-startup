// src/hooks/useGetAllComments.js
import { useEffect } from "react";
import axios from "axios";
import useCommentStore from "@/store/commentStore"; // ✅ Updated to use Zustand store

const useGetAllComments = (postId, open = true) => {
  const setComments = useCommentStore((state) => state.setComments);

  const fetchComments = async () => {
    if (!postId) return;
    try {
      const res = await axios.get(`http://localhost:4000/comment/${postId}`, {
        withCredentials: true,
      });
      // ✅ Call the Zustand store action directly
      setComments(res.data.comments);
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  };

  useEffect(() => {
    if (open) fetchComments();
  }, [postId, open, setComments]);

  return { refetch: fetchComments };
};

export default useGetAllComments;