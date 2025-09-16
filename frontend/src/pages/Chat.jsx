import React, { useEffect, useState } from "react";
import { useChat } from "@/hooks/useChat"; // ✅ Use the new Zustand-based hook
import Messages from "@/components/frontendComponents/Messages";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const Chat = () => {
  const {
    conversations,
    selectedUser,
    loadConversations,
    loadMessages,
    selectedConversation,
    sendNewMessage,
    selectedMessages,
  } = useChat();

  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    loadConversations();
  }, []);

  const handleSelectConversation = (conv) => {
    loadMessages(conv._id);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    sendNewMessage(selectedConversation, newMessage.trim());
    setNewMessage("");
  };

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* Sidebar */}
      <div className="w-[300px] border-r border-gray-200 overflow-y-auto">
        <div className="p-4 font-semibold text-lg">Chats</div>
        {conversations?.map((conv) => (
          <div
            key={conv._id}
            onClick={() => handleSelectConversation(conv)}
            className={`p-3 cursor-pointer hover:bg-gray-100 ${
              selectedConversation === conv._id ? "bg-gray-200" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={conv?.participant?.profilePicture} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{conv.participant?.username}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chat */}
      <div className="flex flex-col flex-1">
        {selectedUser ? (
          <>
            <Messages selectedUser={selectedUser} messages={selectedMessages} />
            <div className="p-4 border-t flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;