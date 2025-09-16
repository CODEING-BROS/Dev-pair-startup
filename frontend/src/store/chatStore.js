import { create } from "zustand";

const useChatStore = create(
  (set, get) => ({
    conversations: [],
    setConversations: (conversations) => set({ conversations }),

    selectedUser: null,
    setSelectedUser: (user) => set({ selectedUser: user }),

    selectedConversation: null,
    setSelectedConversation: (conversationId) => set({ selectedConversation: conversationId }),

    unreadCount: 0,
    incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
    resetUnread: () => set({ unreadCount: 0 }),

    messages: [],
    setMessages: (messages) => set({ messages }),
    addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

    selectConversation: (conversationId, participantUser) => {
      set({
        selectedConversation: conversationId,
        selectedUser: participantUser,
      });
    },
  }),
  {
    name: "chat-storage",
  }
);

export default useChatStore;