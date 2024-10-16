let videoPlayer: HTMLVideoElement | null = null;
let prevVideoId: string | null = null;

function getVideoPlayer() {
  const video = document.querySelector("video");
  if (!video) {
    console.log("No video found.");
    setTimeout(getVideoPlayer, 1000);
    return;
  }

  videoPlayer = video as HTMLVideoElement;

  console.log("Video found:", video);
}

getVideoPlayer();

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      if (!document.contains(videoPlayer)) {
        console.log(
          "Video player no longer exists. Re-running getVideoPlayer."
        );
        getVideoPlayer();
      }
    }
  });
});

function getTitleAndAuthor(): { title: string; author: string } {
  // This seems to fetch the correct element
  const title = document.querySelectorAll(
    "ytmusic-player-bar yt-formatted-string.title, ytmusic-player-controls yt-formatted-string.title"
  );

  const author = document.querySelectorAll(
    "ytmusic-player-bar yt-formatted-string.byline, ytmusic-player-controls yt-formatted-string.byline"
  );

  function findFirstTextContent(elements: NodeListOf<Element>) {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const child = element.firstElementChild;
      if (child && child.textContent) {
        return child.textContent;
      } else if (element.textContent) {
        return element.textContent;
      } else {
        console.warn("No text content found in element:", element);
      }
    }
    return "";
  }

  return {
    title: findFirstTextContent(title),
    author: findFirstTextContent(author),
  };
}

window.navigation?.addEventListener("navigate", (e) => {
  console.log("Navigation event:", e);
  const currentId = new URL(e.destination.url).searchParams.get("v");
  if (currentId) {
    if (prevVideoId === null) {
      prevVideoId = currentId;
    }
    console.log("Video ID:", prevVideoId);
    if (videoPlayer && videoPlayer.currentTime >= videoPlayer.duration - 1) {
      console.log("Video watched:", prevVideoId);
      const { title, author } = getTitleAndAuthor();
      chrome.runtime
        .sendMessage({
          type: "VIDEO_WATCHED",
          videoId: prevVideoId,
          title,
          author,
        })
        .then(() => {
          console.log("Message sent.");
        })
        .catch((err) => {
          console.error("Failed to send message:", err);
        });
    }
    prevVideoId = currentId;
  }
});
