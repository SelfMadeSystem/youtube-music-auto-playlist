/// <reference types="navigation-api-types" />

type PlaylistType = {
  videoId: string;
  duplicates?: string[];
  title: string;
  author: string;
  firstWatched?: number;
  lastWatched?: number;
};
