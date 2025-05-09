import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiPlus, FiSearch, FiList } from "react-icons/fi";

export default function Sidebar({
  openModal,
  onSelectPlaylist,
  showModal,
}) {
  const [playlists, setPlaylists] = useState([]); // <-- Local state for playlists

  const toggleModal = () => {
    openModal(!showModal);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    axios.get("/api/playlists/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(res => {
      console.log("Playlists:", res.data);
      setPlaylists(res.data);
    })
    .catch(err => {
      console.error("Failed to fetch playlists:", err);
    });
  }, []);
  

  return (
    <aside className="relative w-1/4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white flex flex-col p-4 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Your Library</h2>
        <button
          onClick={toggleModal}
          className={`p-2 rounded-full transition-transform duration-300 hover:bg-white/10 ${showModal ? "rotate-45" : ""}`}
          title="Create Playlist"
        >
          <FiPlus className="text-white text-lg transform transition-transform duration-300" />
        </button>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-4">
        <button className="px-3 py-1 text-xs bg-white/10 rounded-full hover:bg-white/20">Playlists</button>
        <button className="px-3 py-1 text-xs bg-white/10 rounded-full hover:bg-white/20">Artists</button>
      </div>

      {/* Search + Sort */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-gray-400">
          <FiSearch className="text-sm" />
          <span className="text-sm">Search</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-sm cursor-pointer hover:text-white">
          <span>Recents</span>
          <FiList className="text-xs" />
        </div>
      </div>

      {/* Playlist List */}
      <div className="main-scroll overflow-y-auto flex-1 pr-1">
        <ul className="space-y-2 text-sm">
          {Array.isArray(playlists) && playlists.map((playlist, i) => (
            <li
              key={playlist.id || i}
              onClick={() => onSelectPlaylist(playlist)}
              className="flex items-center gap-3 p-2 rounded hover:bg-white/10 cursor-pointer text-lg font-semibold"
            >
              <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-white"
                >
                  <path d="M9 19V6l12-2v13h-2v-9.11L11 8.6V19a3 3 0 1 1-2-2.83z" />
                </svg>
              </div>
              <div className="flex flex-col overflow-hidden">
                <p className="text-white truncate">{playlist.name}</p>
                <p className="text-sm text-gray-400 truncate">
                  Playlist • {playlist.owner?.username || "You"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
