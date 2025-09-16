import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus, XCircle, CheckCircle2 } from "lucide-react";
import Navbar from "./Navbar";

const sampleAvatars = [
  "https://randomuser.me/api/portraits/men/72.jpg",
  "https://randomuser.me/api/portraits/women/65.jpg",
  "https://randomuser.me/api/portraits/men/34.jpg",
  "https://randomuser.me/api/portraits/women/12.jpg",
];

const techOptions = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "Go",
  "Ruby",
  "TypeScript",
];

const skillLevels = ["Beginner", "Intermediate", "Advanced"];

export default function CreateRoomPage({ rooms = [], setRooms = () => {} }) {
  const navigate = useNavigate();

  const [newRoom, setNewRoom] = useState({
    title: "",
    tags: "",
    maxPeople: 2,
    isPrivate: false,
    description: "",
    language: "",
    skillLevel: "Intermediate",
    sessionDuration: "",
  });

  const handleCreateRoom = () => {
    if (newRoom.title.trim() === "") {
      alert("Room title is required.");
      return;
    }
    if (!newRoom.language) {
      alert("Please select the primary language or tech stack.");
      return;
    }
    const tagsArray = newRoom.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const newEntry = {
      id: Date.now(),
      title: newRoom.title,
      tags: tagsArray,
      people: 1,
      maxPeople: newRoom.maxPeople,
      avatars: [sampleAvatars[0]],
      description: newRoom.description || "No description provided.",
      isPrivate: newRoom.isPrivate,
      language: newRoom.language,
      skillLevel: newRoom.skillLevel,
      sessionDuration: newRoom.sessionDuration,
    };

    setRooms((prev) => [newEntry, ...prev]);
    navigate("/");
  };

  const {
    title,
    tags,
    maxPeople,
    isPrivate,
    description,
    language,
    skillLevel,
    sessionDuration,
  } = newRoom;

  return (
    <>
      <div className="sticky top-0 z-50 bg-[#010309]">
        <Navbar />
      </div>

      <main className="min-h-screen bg-[#010309] bg-noise pt-20 px-6 flex justify-center items-start pb-16">
        <section
          className="w-full max-w-3xl p-12 rounded-3xl shadow-2xl border border-blue-700/20
            bg-gradient-to-br from-[#010309] via-[#10192b] to-[#0a1c36]
            ring-2 ring-blue-700/50 backdrop-blur-sm relative"
          aria-label="Create New Room Section"
        >
          <div className="absolute -top-12 right-14 w-32 h-32 rounded-full bg-gradient-to-br from-blue-900 via-blue-600 to-indigo-700 blur-3xl opacity-40 pointer-events-none"></div>

          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-purple-400 drop-shadow-md mb-10 flex items-center gap-4">
            <UserPlus className="w-10 h-10 text-blue-300 drop-shadow" />
            Create New Room
          </h1>

          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateRoom();
            }}
            noValidate
            aria-label="Create Room Form"
          >
            {/* Room Title */}
            <div className="md:col-span-2">
              <label
                htmlFor="room-title"
                className="block text-sm font-semibold text-blue-100 mb-1"
              >
                Room Title
              </label>
              <input
                id="room-title"
                name="roomTitle"
                type="text"
                placeholder="Enter room title"
                autoFocus
                className="w-full rounded-lg px-5 py-3 bg-[#0a1120] border border-blue-700/40 text-blue-200
                  focus:border-sky-500 focus:ring-blue-500 focus:ring-2 placeholder:text-blue-400 shadow-glow transition"
                value={title}
                onChange={(e) =>
                  setNewRoom((prev) => ({ ...prev, title: e.target.value }))
                }
                required
                aria-required="true"
              />
            </div>

            {/* Language / Tech Stack */}
            <div>
              <label
                htmlFor="language"
                className="block text-sm font-semibold text-blue-100 mb-1"
              >
                Primary Language / Tech Stack
              </label>
              <select
                id="language"
                name="language"
                value={language}
                onChange={(e) =>
                  setNewRoom((prev) => ({ ...prev, language: e.target.value }))
                }
                className="w-full rounded-lg px-4 py-3 bg-[#0a1120] border border-blue-700/40 text-blue-200
                  focus:border-sky-500 focus:ring-blue-500 focus:ring-2 shadow-glow transition"
                required
              >
                <option value="" disabled>
                  Select language
                </option>
                {techOptions.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
            </div>

            {/* Skill Level */}
            <fieldset className="space-y-2">
              <legend className="block text-sm font-semibold text-blue-100 mb-1">
                Skill Level
              </legend>
              <div className="flex gap-4">
                {skillLevels.map((level) => (
                  <label
                    key={level}
                    className="inline-flex items-center gap-2 cursor-pointer select-none"
                  >
                    <input
                      type="radio"
                      name="skillLevel"
                      value={level}
                      checked={skillLevel === level}
                      onChange={(e) =>
                        setNewRoom((prev) => ({ ...prev, skillLevel: e.target.value }))
                      }
                      className="form-radio accent-blue-600"
                    />
                    <span className="text-blue-300">{level}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Tags */}
            <div>
              <label
                htmlFor="room-tags"
                className="block text-sm font-semibold text-blue-100 mb-1"
              >
                Tags{" "}
                <span className="text-xs text-blue-300">(comma separated)</span>
              </label>
              <input
                id="room-tags"
                name="roomTags"
                type="text"
                placeholder="e.g. React, JavaScript, Beginner"
                className="w-full rounded-lg px-5 py-3 bg-[#0a1120] border border-blue-700/40 text-blue-200
                  focus:border-sky-500 focus:ring-blue-500 focus:ring-2 placeholder:text-blue-400 shadow-glow transition"
                value={tags}
                onChange={(e) =>
                  setNewRoom((prev) => ({ ...prev, tags: e.target.value }))
                }
              />
            </div>

            {/* Max Participants */}
            <div>
              <label
                htmlFor="room-max-participants"
                className="block text-sm font-semibold text-blue-100 mb-1"
              >
                Max Participants
              </label>
              <input
                id="room-max-participants"
                name="maxParticipants"
                type="number"
                min={2}
                max={10}
                className="w-full rounded-lg px-5 py-3 bg-[#0a1120] border border-blue-700/40 text-blue-200
                  focus:border-sky-500 focus:ring-blue-500 focus:ring-2 shadow-glow transition"
                value={maxPeople}
                onChange={(e) =>
                  setNewRoom((prev) => ({
                    ...prev,
                    maxPeople: Math.max(2, Math.min(10, Number(e.target.value))),
                  }))
                }
              />
            </div>

            {/* Session Duration (optional) */}
            <div>
              <label
                htmlFor="session-duration"
                className="block text-sm font-semibold text-blue-100 mb-1"
              >
                Session Duration (minutes){" "}
                <span className="text-xs text-blue-300">(optional)</span>
              </label>
              <input
                id="session-duration"
                name="sessionDuration"
                type="number"
                min={0}
                placeholder="e.g. 60"
                className="w-full rounded-lg px-5 py-3 bg-[#0a1120] border border-blue-700/40 text-blue-200
                  focus:border-sky-500 focus:ring-blue-500 focus:ring-2 shadow-glow transition"
                value={sessionDuration}
                onChange={(e) =>
                  setNewRoom((prev) => ({
                    ...prev,
                    sessionDuration: e.target.value,
                  }))
                }
              />
            </div>

            {/* Room Privacy */}
            <div className="flex items-center gap-2 mt-3 md:mt-6 md:col-span-2">
              <input
                type="checkbox"
                name="isPrivate"
                id="is-private"
                checked={isPrivate}
                onChange={(e) =>
                  setNewRoom((prev) => ({ ...prev, isPrivate: e.target.checked }))
                }
                className="form-checkbox accent-blue-600 scale-125"
              />
              <label
                htmlFor="is-private"
                className="select-none text-blue-200 font-semibold"
                title="Private rooms can only be joined via an invitation link"
              >
                Private Room
              </label>
              <p className="text-xs text-blue-400 italic ml-3 max-w-xl">
                Private rooms require an invite link to join, providing extra control over collaborators.
              </p>
            </div>

            {/* Description (full width) */}
            <div className="md:col-span-2">
              <label
                htmlFor="room-description"
                className="block text-sm font-semibold text-blue-100 mb-1"
              >
                Description{" "}
                <span className="text-xs text-blue-300">(optional)</span>
              </label>
              <textarea
                id="room-description"
                name="roomDescription"
                placeholder="Brief description"
                rows={4}
                className="w-full rounded-lg px-5 py-3 bg-[#0a1120] border border-blue-700/40 text-blue-200
                  focus:border-sky-500 focus:ring-blue-500 focus:ring-2 placeholder:text-blue-400 shadow-glow transition resize-y"
                value={description}
                onChange={(e) =>
                  setNewRoom((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>

            {/* Buttons full width */}
            <div className="md:col-span-2 flex justify-end gap-6 mt-8">
              <Button
                variant="outline"
                size="md"
                className="flex gap-3 items-center border-none text-pink-400 py-2 px-4 hover:bg-pink-600 hover:text-white hover:border-pink-400/60 transition"
                onClick={() => navigate("/")}
                type="button"
              >
                <XCircle className="w-6 h-6" />
                Cancel
              </Button>
              <Button
                size="md"
                type="submit"
                className="flex gap-3 items-center bg-gradient-to-tr py-2 px-4 from-blue-700 to-sky-500 text-white font-bold shadow-lg shadow-blue-700/20 border-0 hover:bg-blue-800 hover:to-blue-600 transition ring-2 ring-transparent hover:ring-blue-500/80"
              >
                <CheckCircle2 className="w-6 h-6" />
                Create Room
              </Button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}
