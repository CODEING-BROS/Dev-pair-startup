// Messages.jsx
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import useAuthStore from "@/store/authStore"; // ✅ Import the Zustand store

const Messages = ({ selectedUser, messages = [] }) => {
  // ✅ Get the current user directly from the Zustand store
  const { user: currentUser } = useAuthStore();

  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center mb-4">
        <div className="flex flex-col items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="font-semibold mt-2">{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View profile
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.senderId === currentUser?._id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-lg max-w-xs break-words ${
                msg.senderId === currentUser?._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;