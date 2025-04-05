export interface Project {
  title: string;
  description: string;
  link: string;
}

const projects: Project[] = [
  {
    title: "d.audio",
    description: "block explorer and dig tool for discovery music on the audius protocol",
    link: "https://d.audio"
  },
  {
    title: "Fanlink",
    description: "Shareable pages that link to all your track's stores. Automatically generated for all tracks on audius, pulling links from track descriptions",
    link: "https://fanlink.audius.community"
  },
  {
    title: "Stem Splitter",
    description: "An AI tool for splitting stems out from a track on audius",
    link: "https://stemsplitter.audius.community"
  },
  {
    title: "Audiuscast",
    description: "A podcast importer for Audius. Sync your RSS feeds to your Audius account and import podcasts automatically.",
    link: "https://audiuscast.com"
  },
  {
    title: "CLI Player",
    description: "A command line interface for Audius. Search for and play tracks, playlists, and podcasts from the comfort of your terminal.",
    link: "https://github.com/audiusproject/cli-player"
  },
  {
    title: "Lyrics On Chain",
    description: "A tool to automatically add lyrics to your tracks on Audius",
    link: "https://github.com/audiusproject/lyrics-on-chain"
  }
];

export default projects; 