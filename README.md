# YouTube Music Auto Playlist Chrome Extension

[![build](https://github.com/SelfMadeSystem/youtube-music-auto-playlist/actions/workflows/build.yml/badge.svg)](https://github.com/SelfMadeSystem/youtube-music-auto-playlist/actions/workflows/build.yml)

This is a Chrome extension that automatically adds fully listened songs to a local playlist. You can edit the entries and export them to a `.csv` file.

## Installation

1. Download the `.zip` file from the [releases](https://github.com/SelfMadeSystem/youtube-music-auto-playlist/releases) page.
2. Extract the contents of the `.zip` file.
3. Open the Chrome browser and navigate to `chrome://extensions/`.
4. Enable the `Developer mode` toggle.
5. Click on the `Load unpacked` button and select the extracted folder.

## Usage

1. Open the YouTube Music website. Must be `https://music.youtube.com/`.
2. Listen to a song. The current URL must be `https://music.youtube.com/watch?v=...` or `https://music.youtube.com/playlist?list=...`. The extension will not add songs if the URL is different (e.g. mini player).
3. The extension will automatically add the song to the playlist after it has been fully listened to. The extension detects this by checking if the progress bar is at the end when a new song starts playing.
    - You can skip to the end of the song to instantly add it to the playlist.
    - You can skip to the next song to skip adding the current song to the playlist.
4. Click on the extension icon to open the popup.
5. Edit the entries in the popup.
6. Click on the `Export to CSV` button to export the entries to a `.csv` file.
7. Enjoy your playlist!

## Features

Features added:

- [x] Automatically adds fully listened songs to a local playlist.
- [x] Edit the entries in the popup.
- [x] Export the entries to a `.csv` file.

Features that may or may not be added in the future:

- [ ] Automatically add songs to a YouTube Music playlist.
  - I originally started working on this, but it seems too complicated to implement. I might revisit this in the future.
- [ ] Multiple playlists.
- [ ] Manual addition of songs to the playlist.

## Development

1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Run `npm run watch` to start the development server.
4. Open the Chrome browser and navigate to `chrome://extensions/`.
5. Enable the `Developer mode` toggle.
6. Click on the `Load unpacked` button and select the `dist` folder.
7. Run `npm run build` to build the extension.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
