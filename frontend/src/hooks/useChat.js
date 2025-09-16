import { useEffect } from "react";
import axios from "axios";
import useChatStore from "@/store/chatStore";
import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export const useChat = () => {
    const {
        conversations,
        selectedConversation,
        selectedUser,
        messages,
        setConversations,
        setMessages,
        addMessage,
        selectConversation,
    } = useChatStore();
    const { user: currentUser } = useAuthStore();
    const navigate = useNavigate();

    const loadConversations = async () => {
        try {
            const res = await axios.get("http://localhost:4000/chat/conversations", {
                withCredentials: true,
            });
            setConversations(res.data);
        } catch (error) {
            console.error("Failed to load conversations:", error);
        }
    };

    const loadMessages = async (conversationId) => {
        try {
            const res = await axios.get(`http://localhost:4000/chat/messages/${conversationId}`, {
                withCredentials: true,
            });
            setMessages(res.data.messages);
        } catch (error) {
            console.error("Failed to load messages:", error);
        }
    };

    const handleSelectConversation = (conversationId, participantUser) => {
        selectConversation(conversationId, participantUser);
        loadMessages(conversationId);
    };

    const sendNewMessage = async (conversationId, message) => {
        try {
            const res = await axios.post(`http://localhost:4000/chat/messages/${conversationId}`, { message }, {
                withCredentials: true,
            });
            if (res.data.success) {
                addMessage(res.data.newMessage);
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const createOrSelectConversation = async (targetUserId) => {
        try {
            const existingConversation = conversations.find(
                (conv) => conv.participant._id === targetUserId
            );

            if (existingConversation) {
                handleSelectConversation(existingConversation._id, existingConversation.participant);
                navigate("/chat");
            } else {
                const res = await axios.post(
                    `http://localhost:4000/chat/conversations/${targetUserId}`,
                    {},
                    { withCredentials: true }
                );

                if (res.data.success) {
                    const newConversation = res.data.conversation;
                    setConversations([...conversations, newConversation]);
                    handleSelectConversation(newConversation._id, newConversation.participant);
                    navigate("/chat");
                }
            }
        } catch (error) {
            console.error("Failed to create/select conversation:", error);
        }
    };

    return {
        conversations,
        selectedConversation,
        selectedMessages: messages,
        currentUser,
        loadConversations,
        loadMessages,
        sendNewMessage,
        selectedUser,
        handleSelectConversation,
        createOrSelectConversation,
        followers: currentUser?.followers || [],
        following: currentUser?.following || [], // ✅ NEW: Expose the following list
    };
};