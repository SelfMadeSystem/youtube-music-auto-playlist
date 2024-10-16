chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received:", message);
  if (message.type === "VIDEO_WATCHED") {
    addToLocalPlaylist(message.videoId, message.title, message.author);
  }
});

function addToLocalPlaylist(videoId: string, title: string, author: string) {
  getLocalPlaylist((playlist) => {
    playlist.push({ videoId, title, author });
    chrome.storage.local.set({ localPlaylist: playlist }, () => {
      console.log("Video added to local playlist:", videoId);
    });
  });
}

function getLocalPlaylist(callback: (playlist: PlaylistType[]) => void) {
  chrome.storage.local.get(["localPlaylist"], (result) => {
    const playlist = result.localPlaylist || [];
    callback(playlist);
  });
}
