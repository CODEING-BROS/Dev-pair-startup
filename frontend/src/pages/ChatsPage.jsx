import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/frontendComponents/Navbar";
import {
  MoreVertical,
  Search,
  MessageSquare,
  CornerDownLeft,
} from "lucide-react";

import ChatHeader from "@/components/frontendComponents/ChatHeader";
import Messages from "@/components/frontendComponents/Messages";

import { useChat } from "@/hooks/useChat";
import useAuthStore from "@/store/authStore";

const ChatsPage = () => {
  const {
    conversations,
    followers,
    following,
    selectedConversation,
    selectedUser,
    selectedMessages,
    loadConversations,
    handleSelectConversation,
    sendNewMessage,
    createOrSelectConversation,
  } = useChat();
  const { user: currentUser } = useAuthStore();

  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("primary");

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    sendNewMessage(selectedConversation, newMessage.trim());
    setNewMessage("");
  };

  // ✅ IMPROVED LOGIC: Creates a unique, combined list in a single, efficient pass
  const getCombinedPrimaryList = () => {
    const userMap = new Map();
    const lists = [following || [], followers || []];
    
    lists.forEach(list => {
      list.forEach(user => {
        // Ensure the user object has a valid ID before adding
        if (user && user._id) {
          userMap.set(user._id, user);
        }
      });
    });
    
    return Array.from(userMap.values());
  };

  const renderPrimaryList = () => {
    const primaryList = getCombinedPrimaryList();
    console.log(primaryList);
    return (
      <div className="flex-1 overflow-y-auto">
        {primaryList?.length > 0 ? (
          primaryList.map((user) => (
            <div
              key={user._id}
              onClick={() => createOrSelectConversation(user._id)}
              className="flex items-center gap-4 p-3 pr-6 cursor-pointer hover:bg-[#202138] transition-colors relative"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={user?.profilePicture} alt={user?.username} />
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate">{user.username}</div>
                <p className="text-sm text-gray-400 truncate">
                  {user.bio || "No bio provided"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 p-4">
            No users to show.
          </div>
        )}
      </div>
    );
  };

  const renderChatsList = () => {
    return (
      <div className="flex-1 overflow-y-auto">
        {conversations?.map((conv) => (
          <div
            key={conv._id}
            onClick={() => handleSelectConversation(conv._id, conv.participant)}
            className={`flex items-center gap-4 p-3 pr-6 cursor-pointer hover:bg-[#202138] transition-colors relative ${
              selectedConversation === conv._id ? "bg-[#28293e] border-l-4 border-blue-500" : ""
            }`}
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src={conv?.participant?.profilePicture} alt={conv?.participant?.username} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white truncate">{conv.participant?.username}</div>
              <p className="text-sm text-gray-400 truncate">Last message...</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderGroupsPlaceholder = () => {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-center text-gray-400">
        <MessageSquare size={80} className="mb-4 text-blue-500 opacity-50" />
        <h2 className="text-xl font-semibold mb-2 text-white">Groups</h2>
        <p className="mb-6">Start a new group chat with your friends.</p>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-6 py-3 shadow-lg">
          New Group
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#151626] text-gray-200">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="flex flex-col w-[350px] border-r border-[#28293e] overflow-y-auto">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center p-4 border-b border-[#28293e]">
            {currentUser && (
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{currentUser.username}</span>
                <span className="text-sm text-gray-400">
                  {currentUser.followers?.length} followers
                </span>
                <span className="text-sm">▼</span>
              </div>
            )}
            <button className="text-gray-400 hover:text-white transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-pen-square"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
              </svg>
            </button>
          </div>
          {/* Tabs */}
          <div className="flex justify-around p-2 border-b border-[#28293e]">
            <Button
              variant="ghost"
              className={`flex-1 text-sm font-semibold rounded-lg ${
                activeTab === "primary"
                  ? "bg-[#28293e] text-white"
                  : "text-gray-400 hover:bg-[#202138]"
              }`}
              onClick={() => setActiveTab("primary")}
            >
              Primary
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 text-sm font-semibold rounded-lg ${
                activeTab === "chats"
                  ? "bg-[#28293e] text-white"
                  : "text-gray-400 hover:bg-[#202138]"
              }`}
              onClick={() => setActiveTab("chats")}
            >
              Chats
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 text-sm font-semibold rounded-lg ${
                activeTab === "groups"
                  ? "bg-[#28293e] text-white"
                  : "text-gray-400 hover:bg-[#202138]"
              }`}
              onClick={() => setActiveTab("groups")}
            >
              Groups
            </Button>
          </div>
          {/* Search */}
          <div className="p-4 border-b border-[#28293e]">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search"
                className="w-full pl-10 bg-[#28293e] border-none rounded-lg text-sm"
              />
            </div>
          </div>
          {/* List based on active tab */}
          {activeTab === "primary" && renderPrimaryList()}
          {activeTab === "chats" && renderChatsList()}
          {activeTab === "groups" && renderGroupsPlaceholder()}
        </div>
        {/* Main Chat Area */}
        <div className="flex flex-col flex-1">
          {selectedConversation ? (
            <>
              <ChatHeader user={selectedUser} />
              <Messages messages={selectedMessages} currentUser={currentUser} />
              <form onSubmit={handleSendMessage} className="p-4 border-t border-[#28293e] flex items-center gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Message..."
                  className="flex-1 bg-[#28293e] border-none text-white rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500"
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg px-4 py-2">
                  <CornerDownLeft size={20} />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center text-gray-400">
              <MessageSquare size={80} className="mb-4 text-blue-500 opacity-50" />
              <h2 className="text-xl font-semibold mb-2 text-white">Your messages</h2>
              <p className="mb-6">Send a message to start a chat.</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-6 py-3 shadow-lg">
                Send message
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;