import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, LogIn, Hash } from "lucide-react";

// Dummy avatars list; replace with real data if available
const dummyAvatars = [
  "https://randomuser.me/api/portraits/men/72.jpg",
  "https://randomuser.me/api/portraits/women/65.jpg",
  "https://randomuser.me/api/portraits/men/34.jpg",
];

const RoomCard = ({
  title,
  tags = [],
  people,
  onJoin,
  description = "No description provided.",
}) => {
  return (
    <Card className="bg-gradient-to-br from-[#16182e] to-[#11131c] border border-gray-800 hover:border-blue-500 hover:shadow-blue-700/40 shadow-xl rounded-2xl w-[320px] flex-shrink-0 transition-all duration-200">
      <CardHeader className="pb-1 flex flex-col items-start">
        <CardTitle
          className="text-base text-white line-clamp-1 font-semibold cursor-default"
          title={title}
        >
          {title.length > 30 ? title.slice(0, 28) + "…" : title}
        </CardTitle>

        {/* Show joined user avatars */}
        <div className="mt-2 flex -space-x-3" aria-label={`${people} users joined`}>
          {dummyAvatars.slice(0, Math.min(people, 3)).map((src, idx) => (
            <img
              key={src}
              src={src}
              alt="user joined avatar"
              className="w-7 h-7 border-2 border-white rounded-full object-cover bg-blue-700 shadow-sm"
              style={{ zIndex: 10 - idx }}
              loading="lazy"
            />
          ))}
          {people > 3 && (
            <span
              className="w-7 h-7 flex items-center justify-center bg-gray-800 text-xs text-gray-200 border-2 border-white rounded-full"
              style={{ zIndex: 5 }}
            >
              +{people - 3}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="text-[15px] text-gray-300 space-y-3 pb-4">
        {/* Room description */}
        <p className="text-xs text-gray-400 line-clamp-2">{description}</p>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-2 text-xs">
          {tags.length > 0 ? (
            tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="flex items-center gap-1 bg-[#1d2333] text-blue-400 px-2 py-0.5 rounded-md select-none"
                title={`#${tag}`}
              >
                <Hash className="w-3 h-3" />
                {tag.length > 15 ? tag.slice(0, 14) + "…" : tag}
              </span>
            ))
          ) : (
            <span className="text-gray-500 italic select-none">No tags</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3">
          <div
            className="flex items-center gap-2 font-medium text-xs text-gray-400 select-none"
            aria-label="people joined"
          >
            <Users className="w-4 h-4" aria-hidden="true" />
            <span>{people} {people === 1 ? "joined" : "joined"}</span>
          </div>
          <Button
            aria-label={`Join ${title}`}
            onClick={onJoin}
            size="sm"
            variant="outline"
            className="text-xs px-3 py-1.5 border-blue-500 hover:bg-blue-500/90 hover:text-white border-2 font-semibold rounded-full flex items-center gap-1 transition-all"
          >
            <LogIn className="w-4 h-4 mr-1" aria-hidden="true" />
            Join
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
