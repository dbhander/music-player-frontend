import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import PlayerBar from "./PlayerBar";
import Navbar from "./Navbar";
import CreatePlaylistModal from "./CreatePlaylistModal";
import axios from "axios";

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [audio, setAudio] = useState(null); // New audio state

  // On mount: link audio element
  useEffect(() => {
    const player = document.getElementById("audio-player");
    setAudio(player);
  }, []);

  useEffect(() => {
    axios
      .get("/secure/hello")
      .then((res) => setMessage(res.data))
      .catch(() => setMessage("Unauthorized"));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("/api/playlists/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPlaylists(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch playlists", err);
      });
  }, []);

  return (
    <div className="h-screen flex flex-col bg-black text-white relative">
      {/* Hidden Audio Element */}
      <audio id="audio-player" hidden />

      {/* Top Navbar */}
      <Navbar
        onHomeClick={() => {
          setSelectedPlaylist(null);
          setSelectedSong(null);
        }}
      />

      {/* Modal above all */}
      {showModal && (
        <div className="fixed top-[145px] left-[207px] z-50">
          <CreatePlaylistModal
            onSelectOption={(type) => {
              if (type === "playlist") {
                setSelectedPlaylist({
                  id: null,
                  name: "My Playlist #New",
                  owner: "You",
                  songs: [],
                });
                setSelectedSong(null);
                setShowModal(false);
              }
            }}
          />
        </div>
      )}

      {/* Middle section */}
      <div
        className="flex px-2 py-2 gap-2 overflow-hidden"
        style={{ height: "calc(100vh - 64px - 80px)" }}
      >
        <Sidebar
          openModal={(v) => setShowModal(v)}
          showModal={showModal}
          playlists={playlists}
          onSelectPlaylist={(playlist) => {
            setSelectedPlaylist(playlist);
            setSelectedSong(null);
            setShowModal(false);
          }}
          handleCreate={() => {
            setSelectedPlaylist({
              id: null,
              name: "My Playlist #New",
              owner: "You",
              songs: [],
            });
            setSelectedSong(null);
            setShowModal(false);
          }}
        />

        <MainContent
          selectedPlaylist={selectedPlaylist}
          selectedSong={selectedSong}
          onSelectSong={setSelectedSong}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          audio={audio} // <-- pass audio element
        />
      </div>

      {/* Bottom PlayerBar */}
      <PlayerBar
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        selectedSong={selectedSong}
        onSelectSong={setSelectedSong}
        audio={audio} // <-- pass audio element
      />
    </div>
  );
}
