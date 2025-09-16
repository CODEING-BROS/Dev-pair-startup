import React, { useRef } from "react";
import RoomCard from "@/components/frontendComponents/RoomCard";

const dummyRooms = [
  { title: "Newer Ronum", tags: ["React", "Beginner"], people: 2 },
  { title: "MarianSomo", tags: ["Beginner"], people: 3 },
  { title: "Orang-Sacc", tags: ["Beginner"], people: 3 },
];

const Rooms = () => {
  const scrollRef = useRef(null);

  const scroll = (scrollOffset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <section aria-labelledby="live-rooms-heading" className="px-4">
      
      {dummyRooms.length === 0 ? (
        <p className="text-gray-400">No rooms are live right now.</p>
      ) : (
        <div className="scroll-container">
          {/* Left Button */}
          <button
            className="scroll-button left"
            aria-label="Scroll left"
            onClick={() => scroll(-300)}
            type="button"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {/* Scrollable Cards */}
          <div
            ref={scrollRef}
            className="flex space-x-4 overflow-x-auto py-2 hide-scrollbar"
            style={{ scrollBehavior: "smooth", paddingLeft: "56px", paddingRight: "56px"}}
          >
            {dummyRooms.map((room) => (
              <RoomCard
                key={room.title}
                {...room}
                onJoin={() => alert(`Joining ${room.title}`)}
              />
            ))}
          </div>
          {/* Right Button */}
          <button
            className="scroll-button right"
            aria-label="Scroll right"
            onClick={() => scroll(300)}
            type="button"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};

export default Rooms;
