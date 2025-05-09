import React, { useEffect, useRef, useState } from "react";
import {
  LuSkipBack,
  LuPlay,
  LuPause,
  LuSkipForward,
  LuRepeat,
  LuShuffle,
  LuVolume2,
} from "react-icons/lu";
import axios from "axios";

export default function PlayerBar({ isPlaying, setIsPlaying, onSelectSong, selectedSong }) {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = volume;

    const audio = audioRef.current;
    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, [selectedSong, volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch((e) => console.error("Play error:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, selectedSong]);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <footer className="w-full py-2 px-4 bg-black flex justify-between items-center text-md h-20 border-t border-white/10">
      {/* Audio Element */}
      {selectedSong && (
        <audio
          ref={audioRef}
          src={selectedSong?.file_path}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Now Playing Info */}
      <div className="flex items-center gap-4 text-sm text-gray-300">
        <img
          src={selectedSong?.thumbnail || "/placeholder.png"}
          alt={selectedSong?.title || "Song"}
          className="w-12 h-12 rounded"
        />
        <div>
          <p className="text-white">{selectedSong?.title || "Track Title"}</p>
          <p className="text-xs text-gray-400">{selectedSong?.artist || "Artist"}</p>
        </div>
      </div>

      {/* Controls + Seekbar */}
      <div className="flex flex-col items-center gap-2 flex-1">
        <div className="flex items-center gap-6 text-white">
          <LuShuffle className="hover:text-green-500 cursor-pointer" />
          <LuSkipBack className="hover:text-green-500 cursor-pointer" />

          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            className="bg-white text-black p-2 rounded-full hover:bg-green-500 transition"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-black">
              {isPlaying ? (
                <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z" />
              ) : (
                <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
              )}
            </svg>
          </button>

          <LuSkipForward
            className="hover:text-green-500 cursor-pointer"
            onClick={() => {
              const token = localStorage.getItem("token");
              axios
                .post("/api/player/skip", {}, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                  const nextSong = res.data;
                  if (nextSong) {
                    onSelectSong(nextSong);
                    localStorage.setItem("currentSongId", nextSong.id);
                    setIsPlaying(true);
                  }
                })
                .catch((err) => {
                  console.error("Skip failed:", err);
                });
            }}
          />

          <LuRepeat
            className="hover:text-green-500 cursor-pointer"
            onClick={() => {
              const token = localStorage.getItem("token");
              const songId = localStorage.getItem("currentSongId");
              if (!songId) return;
              axios
                .post(`/api/player/repeat/${songId}`, {}, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .catch((err) => console.error("Repeat failed:", err));
            }}
          />
        </div>

        {/* Seek Bar */}
        <div className="flex items-center gap-2 text-sm text-gray-400 justify-center">
          <span className="text-xs">
            {formatTime(audioRef.current?.currentTime)}
          </span>
          <div className="relative w-[500px] h-1 bg-white/20 rounded overflow-hidden">
            <div
              className="absolute top-0 left-0 h-1 bg-white rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-xs">
            {formatTime(audioRef.current?.duration)}
          </span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 text-white">
        <LuVolume2 />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          className="w-24"
        />
      </div>
    </footer>
  );
}
