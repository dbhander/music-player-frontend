import React from 'react';
import axios from 'axios';
import { FiPlusCircle, FiUsers, FiFolder } from 'react-icons/fi';

export default function CreatePlaylistModal({ onSelectOption, onClose }) {
  const handlePlaylistClick = () => {
    const token = localStorage.getItem("token");

    // Temporary hardcoded values (replace with state-controlled inputs later)
    const genre = "pop";
    const mood = "happy";

    axios.post("/api/playlists/generate", {
      genre,
      mood
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(() => {
      alert("Playlist generated!");
      onSelectOption('playlist');
      onClose(); // Close the modal after success
    }).catch(err => {
      console.error("Playlist creation failed", err);
      alert("Failed to generate playlist.");
    });
  };

  return (
    <div className="w-64 bg-[#282828] text-white rounded-xl shadow-lg backdrop-blur-md border border-white/10 p-4 space-y-2 relative">
      <div
        className="flex items-center space-x-3 p-2 rounded-md hover:bg-white/10 cursor-pointer transition"
        onClick={handlePlaylistClick}
      >
        <FiPlusCircle className="text-xl" />
        <div>
          <p className="text-sm font-semibold">Playlist</p>
          <p className="text-xs text-gray-400">Build a playlist with songs or episodes</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-white/10 cursor-pointer transition">
        <FiUsers className="text-xl" />
        <div>
          <p className="text-sm font-semibold">Blend</p>
          <p className="text-xs text-gray-400">Mix up your tastes with friends</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-white/10 cursor-pointer transition">
        <FiFolder className="text-xl" />
        <div>
          <p className="text-sm font-semibold">Folder</p>
          <p className="text-xs text-gray-400">Organise your playlists</p>
        </div>
      </div>
    </div>
  );
}
