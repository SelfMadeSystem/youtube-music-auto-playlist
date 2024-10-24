chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received:", message);
  if (message.type === "VIDEO_WATCHED") {
    addToLocalPlaylist(message.videoId, message.title, message.author);
  }
});

function addToLocalPlaylist(videoId: string, title: string, author: string) {
  const now = Date.now();
  getLocalPlaylist((playlist) => {
    const current = playlist.find((item) => item.videoId === videoId || item.duplicates?.includes(videoId)) || {
      videoId,
      title,
      author,
      firstWatched: now,
      lastWatched: now,
    };
    current.lastWatched = now;
    if (current.firstWatched === undefined) {
      current.firstWatched = now;
    }
    const updated = playlist.filter((item) => item.videoId !== current.videoId);
    updated.push(current);
    chrome.storage.local.set({ localPlaylist: updated }, () => {
      console.log(
        "Video added to local playlist:",
        videoId,
        current,
        updated,
      );
    });
  });
}

function getLocalPlaylist(callback: (playlist: PlaylistType[]) => void) {
  chrome.storage.local.get(["localPlaylist"], (result) => {
    const playlist = result.localPlaylist || [];
    callback(playlist);
  });
}
