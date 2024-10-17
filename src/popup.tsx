import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";
import "./tailwind.css";

/**
 * Normalizes a string by removing all whitespace, periods, dashes, and apostrophes,
 * converting it to lowercase, and removing all accents and (eg `ﬁ` -> `fi`)
 */
export function normalizeString(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[\u0300-\u036F.\-'\s]/g, "")
    .toLowerCase();
}

/**
 * Escape a string for CSV.
 *
 * If the string contains a comma, newline, or double quote, it will be
 * surrounded by double quotes. If the string contains a double quote, it
 * will be escaped by doubling it.
 */
const escapeCSV = (str: string) => {
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const toCSV = (playlist: PlaylistType[]) => {
  return playlist
    .map(
      (item) =>
        `${escapeCSV(item.videoId)},${escapeCSV(item.title)},${escapeCSV(item.author)}`
    )
    .join("\n");
};

const Popup = () => {
  const [playlist, setPlaylist] = useState<PlaylistType[]>([]);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newAuthor, setNewAuthor] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [filteredPlaylist, setFilteredPlaylist] = useState<PlaylistType[]>([]);

  function filterPlaylist(newFilter?: string) {
    if (newFilter !== undefined) {
      setFilter(newFilter);
    }
    const normalizedFilter = normalizeString(newFilter ?? filter);
    setFilteredPlaylist(
      playlist.filter(
        (item) =>
          normalizeString(item.title).includes(normalizedFilter) ||
          normalizeString(item.author).includes(normalizedFilter)
      )
    );
  }

  useEffect(filterPlaylist, [playlist]);

  useEffect(() => {
    chrome.storage.local.get(["localPlaylist"]).then(((result: {
      localPlaylist: PlaylistType[];
    }) => {
      const playlist = (result.localPlaylist || []).filter((item) => {
        return (
          typeof item === "object" &&
          item !== null &&
          typeof item.videoId === "string" &&
          typeof item.title === "string" &&
          typeof item.author === "string"
        );
      });
      console.log("Playlist loaded:", playlist);
      setPlaylist(playlist);
    }) as (result: { [key: string]: any }) => void);
    console.log("Popup mounted");
  }, []);

  const removeVideo = (videoId: string) => {
    const confirmation = confirm("Are you sure you want to remove this video?");
    if (!confirmation) return;
    const updatedPlaylist = playlist.filter((id) => id.videoId !== videoId);
    setPlaylist(updatedPlaylist);
    chrome.storage.local.set({ localPlaylist: updatedPlaylist });
  };

  const startEditing = (videoId: string, title: string, author: string) => {
    setEditingVideoId(videoId);
    setNewTitle(title);
    setNewAuthor(author);
  };

  const saveChanges = (videoId: string) => {
    const updatedPlaylist = playlist.map((item) =>
      item.videoId === videoId
        ? { ...item, title: newTitle, author: newAuthor }
        : item
    );
    setPlaylist(updatedPlaylist);
    chrome.storage.local.set({
      localPlaylist: updatedPlaylist,
    });
    setEditingVideoId(null);
  };

  const exportToCSV = () => {
    const csv = toCSV(playlist);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({
      url,
      filename: "playlist.csv",
      saveAs: true,
    });
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
      <div className="flex flex-row">
        <h1 className="text-2xl font-bold">Playlist</h1>
        <div className="ml-auto">Songs: {playlist.length}</div>
      </div>
      <div className="flex flex-row gap-2">
        <button
          className="mt-4 bg-blue-700 rounded-md p-2 text-white w-max shrink-0"
          onClick={exportToCSV}
        >
          Export to CSV
        </button>
        <input
          type="text"
          value={filter}
          onChange={(e) => filterPlaylist(e.target.value)}
          placeholder="Filter"
          className="mt-4 w-full p-2 border-black border"
        />
      </div>
      <ul className="mt-4">
        {filteredPlaylist.map((item) => {
          const href = `https://music.youtube.com/watch?v=${item.videoId}`;
          return (
            <li key={item.videoId} className="flex items-center space-x-2">
              <a href={href} target="_blank" rel="noreferrer" className="relative">
                <img
                  src={`https://img.youtube.com/vi/${item.videoId}/default.jpg`}
                  alt={item.title}
                  className="w-16 h-12 relative"
                />
                <div className="hover-overlay">
                  Open
                </div>
              </a>
              <div className="flex-1">
                {editingVideoId === item.videoId ? (
                  <>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="font-sm w-full border-black border"
                    />
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="font-sm w-full border-black border"
                    />
                    <button
                      className="ml-auto bg-green-700 rounded-md p-2 text-white"
                      onClick={() => saveChanges(item.videoId)}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      className="font-bold text-blue-700 hover:underline"
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.title}
                    </a>
                    <p className="text-sm">{item.author}</p>
                    <button
                      className="ml-auto w-full bg-gray-300 rounded-md p-2 text-black"
                      onClick={() =>
                        startEditing(item.videoId, item.title, item.author)
                      }
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
              <button
                className="ml-auto bg-red-700 rounded-md p-2 text-white"
                onClick={() => removeVideo(item.videoId)}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
