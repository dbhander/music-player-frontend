import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

export default function MainContent({
  selectedPlaylist,
  selectedSong,
  onSelectSong,
  isPlaying,
  setIsPlaying,
}) {
  const playButtonRef = useRef(null);
  const mainRef = useRef(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchSongs = async () => {
      try {
        const res = selectedPlaylist
          ? await axios.get(`/api/playlists/${selectedPlaylist.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          : await axios.get("/api/songs", {
              headers: { Authorization: `Bearer ${token}` },
            });

        setSongs(selectedPlaylist ? res.data.songs : res.data);
      } catch (err) {
        console.error("Error fetching songs:", err);
      }
    };

    fetchSongs();
  }, [selectedPlaylist]);

  useEffect(() => {
    const handleScroll = () => {
      if (!playButtonRef.current) return;
      const { top } = playButtonRef.current.getBoundingClientRect();
      setShowStickyBar(top < 64);
    };
    const scrollContainer = document.querySelector("main");
    scrollContainer?.addEventListener("scroll", handleScroll);
    return () => scrollContainer?.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePlayPause = () => {
    const token = localStorage.getItem("token");
    if (!selectedSong) return;

    const endpoint = isPlaying
      ? `/api/player/pause/${selectedSong.id}`
      : `/api/player/play/${selectedSong.id}`;

    axios
      .post(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } })
      .catch((err) => {
        console.error("Playback failed:", err);
      });

    setIsPlaying(!isPlaying);
  };

  // 🎵 Song Detail View
  if (selectedSong) {
    return (
      <main
        ref={mainRef}
        className="main-scroll flex-1 overflow-y-auto p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-md text-white"
      >
        {/* Sticky bar */}
        <div
          className={`sticky -top-6 z-40 px-4 py-2 flex items-center justify-stretch
                      bg-gradient-to-b from-black/95 to-black/80 backdrop-blur-sm
                      transition-all duration-500 ease-in-out
                      ${
                        showStickyBar
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-2 pointer-events-none"
                      }`}
        >
          <button
            onClick={handlePlayPause}
            className={`text-black p-2 rounded-full bg-green-500 transition-opacity duration-500 ease-in-out
                        ${
                          showStickyBar
                            ? "opacity-100 delay-200"
                            : "opacity-0 delay-0"
                        }`}
          >
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-10 h-10 text-black p-2"
            >
              {isPlaying ? (
                <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z" />
              ) : (
                <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
              )}
            </svg>
          </button>
          <div className="ml-5 text-2xl font-bold">{selectedSong.title}</div>
        </div>

        {/* Song Info */}
        <div className="flex items-start gap-6 mb-6">
          <img
            src={selectedSong.thumbnail}
            alt={selectedSong.title}
            className="w-40 h-40 rounded shadow"
          />
          <div>
            <p className="text-sm uppercase text-gray-300">Song</p>
            <h1 className="text-4xl font-bold">{selectedSong.title}</h1>
            <p className="text-gray-400 mt-1">
              {selectedSong.artist} • {selectedSong.album} •{" "}
              {selectedSong.duration}
            </p>
          </div>
        </div>

        {/* Play Button */}
        <div className="flex items-center gap-4 mt-6" ref={playButtonRef}>
          <button
            onClick={handlePlayPause}
            className="text-black p-2 rounded-full bg-green-500 transition"
          >
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-10 h-10 text-black p-2"
            >
              {isPlaying ? (
                <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z" />
              ) : (
                <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
              )}
            </svg>
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm">
            Add
          </button>
        </div>

        {/* Lyrics */}
        {selectedSong.lyrics && (
          <div className="mt-7">
            <h2 className="text-lg font-semibold mb-2">Lyrics</h2>
            <pre className="whitespace-pre-wrap text-gray-300 text-sm w-1/2">
              {selectedSong.lyrics}
            </pre>
          </div>
        )}

        {/* Artists */}
        {Array.isArray(selectedSong.artists) && (
          <div className="mt-6">
            <p className="uppercase font-semibold text-xs text-gray-400 mb-3">
              Artists
            </p>
            {selectedSong.artists.map((artist, index) => (
              <div key={index} className="flex items-center gap-4 mb-6">
                <img
                  src={artist.image || "/placeholder.png"}
                  alt={artist.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs text-gray-400 font-medium">Artist</p>
                  <p className="text-white font-semibold">{artist.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    );
  }

  // Playlist or All Songs View
  return (
    <main className="flex-1 overflow-y-auto p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-md text-white">
      {selectedPlaylist && (
        <div className="flex items-end gap-6 mb-6">
          <div className="w-48 h-48 bg-gray-700 rounded shadow-md"></div>
          <div>
            <p className="text-sm uppercase text-gray-400 font-semibold mb-1">
              Playlist
            </p>
            <h1 className="text-4xl font-bold">{selectedPlaylist.name}</h1>
            <p className="text-sm text-gray-300 mt-1">
              By {selectedPlaylist.owner?.username || "You"}
            </p>
          </div>
        </div>
      )}

      {/* Song Table Header */}
      <div className="grid grid-cols-12 text-gray-400 uppercase text-xs border-b border-white/10 py-2 px-2 tracking-wider">
        <div className="col-span-1">#</div>
        <div className="col-span-5">Title</div>
        <div className="col-span-3">Album</div>
        <div className="col-span-2">Date Added</div>
        <div className="col-span-1 text-right">⏱</div>
      </div>

      {/* Song Rows */}
      {songs.map((song, index) => (
        <div
          key={song.id}
          className="grid grid-cols-12 items-center text-sm py-3 px-2 hover:bg-white/10 transition rounded cursor-pointer"
          onClick={() => {
            onSelectSong(song);
            localStorage.setItem("currentSongId", song.id);
          }}
        >
          <div className="col-span-1 text-gray-400">{index + 1}</div>
          <div className="col-span-5 flex items-center gap-4">
            <img
              src={song.thumbnail || "/placeholder.png"}
              alt={song.title}
              className="w-10 h-10 rounded object-cover"
            />
            <div>
              <p className="text-white font-semibold">{song.title}</p>
              <p className="text-xs text-gray-400">{song.artist}</p>
            </div>
          </div>
          <div className="col-span-3 text-gray-300 text-sm">{song.album}</div>
          <div className="col-span-2 text-gray-400 text-sm">
            {song.dateAdded}
          </div>
          <div className="col-span-1 text-gray-400 text-sm text-right">
            {song.duration}
          </div>
        </div>
      ))}
    </main>
  );
}
