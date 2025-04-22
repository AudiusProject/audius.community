export interface Project {
  title: string;
  description: string;
  link: string;
}

const projects: Project[] = [
  {
    title: "Fanlink",
    description: "Shareable pages that link to all your track's stores. Automatically generated for all tracks on audius, pulling links from track descriptions.",
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
    title: "Audius Terminal Player",
    description: "A music player to steam and discover music on Audius directly from your terminal.",
    link: "https://github.com/Kyle-Shanks/audius_cli_player_test"
  },
  {
    title: "Lyrics On Chain",
    description: "A tool to automatically add lyrics to your tracks on Audius",
    link: "http://lyricsonchain.com/"
  },
  {
    title: "Elemental",
    description: "A lightweight and fast minimal audius ui",
    link: "https://elemental.stereosteve.com"
  },
  {
    title: "aTunes",
    description: "A retro iTunes theme for the audius protocol.",
    link: "https://atunes.audius.community"
  }
];

export default projects; 