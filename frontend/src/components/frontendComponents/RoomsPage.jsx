import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoomCard from "./RoomCard"; // Adjust the path as needed
import { Button } from "@/components/ui/button";
import { UserPlus, LogIn, Shuffle } from "lucide-react";


// Sample avatars (replace with your real data or API)
const sampleAvatars = [
  "https://randomuser.me/api/portraits/men/72.jpg",
  "https://randomuser.me/api/portraits/women/65.jpg",
  "https://randomuser.me/api/portraits/men/34.jpg",
  "https://randomuser.me/api/portraits/women/12.jpg",
];

// Initial sample rooms data
const initialRooms = [
  {
    id: 1,
    title: "React Beginners",
    tags: ["React", "JavaScript"],
    people: 3,
    maxPeople: 5,
    avatars: sampleAvatars.slice(0, 3),
    description: "A room for learning React together.",
    isPrivate: false,
  },
  {
    id: 2,
    title: "Python Pair Programming",
    tags: ["Python", "Backend"],
    people: 2,
    maxPeople: 4,
    avatars: sampleAvatars.slice(1, 3),
    description: "Pair up for Python backend challenges.",
    isPrivate: true,
  },
  {
    id: 3,
    title: "Fullstack Fun",
    tags: ["Node", "React", "Fullstack"],
    people: 1,
    maxPeople: 3,
    avatars: sampleAvatars.slice(2, 3),
    description: "Building fullstack projects.",
    isPrivate: false,
  },
];

export default function RoomsPage() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredTags, setFilteredTags] = useState([]); // multi-tag filter

  useEffect(() => {
    setRooms(initialRooms); // simulate fetching data from backend
  }, []);

  // Extract all unique tags from rooms for filter display
  const allTags = Array.from(
    new Set(rooms.flatMap((room) => room.tags))
  ).sort();

  // Toggles tags in filteredTags array for multi-filtering
  const toggleTagFilter = (tag) => {
    setFilteredTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Filter rooms based on search and selected tags (OR filter on tags)
  const filteredRooms = rooms.filter((room) => {
    const searchLower = search.toLowerCase();

    const matchesSearch =
      room.title.toLowerCase().includes(searchLower) ||
      room.tags.some((tag) => tag.toLowerCase().includes(searchLower));

    const matchesTagFilter =
      filteredTags.length === 0 ||
      filteredTags.some((filterTag) => room.tags.includes(filterTag));

    return matchesSearch && matchesTagFilter;
  });

  // Mock handler to join a specific room
  const handleJoinRoom = (roomId) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;

    if (room.people >= room.maxPeople) {
      alert(`Room "${room.title}" is full!`);
      return;
    }

    alert(`Joined room: "${room.title}"`);

    // Update state by increasing participants count (mock avatars cycling)
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? {
              ...r,
              people: r.people + 1,
              avatars: [
                ...r.avatars,
                sampleAvatars[r.people % sampleAvatars.length],
              ],
            }
          : r
      )
    );
  };

  // Mock handler to join a random public room that is not full
  const handleJoinRandom = () => {
    const publicOpenRooms = rooms.filter(
      (r) => !r.isPrivate && r.people < r.maxPeople
    );

    if (publicOpenRooms.length === 0) {
      alert("No available public rooms to join right now.");
      return;
    }

    const randomRoom =
      publicOpenRooms[Math.floor(Math.random() * publicOpenRooms.length)];
    handleJoinRoom(randomRoom.id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <h1 className="text-4xl font-bold mb-7 text-white tracking-tight flex gap-2 items-center drop-shadow-lg">
        <LogIn className="inline w-8 h-8 text-blue-400" />
        Coding Rooms
      </h1>

      {/* Search and actions */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <input
          type="text"
          placeholder="Search rooms by title or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search rooms by title or tag"
          className="flex-grow max-w-md px-4 py-2 rounded-md border border-gray-700 bg-[#1e1e2e] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
        />

        <Button
          onClick={handleJoinRandom}
          variant="outline"
          size="sm"
          className="flex gap-2 items-center border-blue-500 text-blue-400 hover:bg-blue-500/90 hover:text-white transition"
          type="button"
          aria-label="Join a random room"
        >
          <Shuffle className="w-4 h-4" />
          Join Random Room
        </Button>

        <Button
          onClick={() => navigate("/create-room")}
          size="sm"
          className="flex items-center gap-2 bg-gradient-to-tr from-blue-700 to-blue-400 text-white hover:from-blue-800 hover:to-blue-500 transition drop-shadow-lg font-semibold"
          type="button"
          aria-label="Create a new room"
        >
          <UserPlus className="w-5 h-5" />
          Create Room
        </Button>
      </div>

      {/* Tags multi-filter */}
      <div
        className="mb-6 flex flex-wrap gap-3 items-center"
        aria-label="Filter rooms by tags"
      >
        <span className="text-gray-400 mr-2 select-none font-semibold">Filter by Tag:</span>
        {allTags.length === 0 && (
          <span className="text-gray-600 italic">No tags available</span>
        )}
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTagFilter(tag)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition select-none ${
              filteredTags.includes(tag)
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white"
            }`}
            aria-pressed={filteredTags.includes(tag)}
            type="button"
          >
            #{tag}
          </button>
        ))}
        {filteredTags.length > 0 && (
          <button
            onClick={() => setFilteredTags([])}
            className="ml-2 px-3 py-1 rounded-full text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition"
            aria-label="Clear all tag filters"
            type="button"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Rooms list */}
      {filteredRooms.length === 0 ? (
        <p className="text-gray-400 italic py-12 text-center">
          No coding rooms found. Try searching or clearing filters.
        </p>
      ) : (
        <div className="flex flex-wrap gap-6" role="list">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              title={room.title}
              tags={room.tags}
              people={room.people}
              avatars={room.avatars}
              description={room.description}
              isPrivate={room.isPrivate}
              onJoin={() => handleJoinRoom(room.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
