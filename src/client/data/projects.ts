export interface Project {
  title: string;
  description: string;
  link: string;
  repository?: string;
}

const projects: Project[] = [
  {
    title: "Fanlink",
    description:
      "Shareable pages that link to all your track's stores. Automatically generated for all tracks on audius, pulling links from track descriptions.",
    link: "https://fanlink.audius.community",
  },
  {
    title: "Stem Splitter",
    description: "An AI tool for splitting stems out from a track on audius",
    link: "https://stemsplitter.audius.community",
  },
  {
    title: "Audiuscast",
    description:
      "A podcast importer for Audius. Sync your RSS feeds to your Audius account and import podcasts automatically.",
    link: "https://audiuscast.com",
    repository: "https://github.com/brycedev/audiuscast",
  },
  {
    title: "Audius Terminal Player",
    description:
      "A music player to steam and discover music on Audius directly from your terminal.",
    link: "https://github.com/Kyle-Shanks/audius_cli_player_test",
    repository: "https://github.com/Kyle-Shanks/audius_cli_player_test",
  },
  {
    title: "Lyrics On Chain",
    description: "A tool to automatically add lyrics to your tracks on Audius",
    link: "http://lyricsonchain.com/",
  },
  {
    title: "aTunes",
    description: "A retro iTunes theme for the protocol.",
    repository: "https://github.com/alecsavvy/atunes",
    link: "https://atunes.audius.community",
  },
  {
    title: "w3.audio",
    description: "A block explorer for the protocol",
    link: "https://w3.audio",
  },
  {
    title: "Constellations",
    description:
      "A clustering algorithm to help you discover new music on Audius",
    link: "https://seancena.github.io/constellation",
  },
  {
    title: "Snag (for Audius)",
    description:
      "A lightweight Chrome extension that lets you quickly grab assets from Audius artist profiles, tracks, playlists, and albums",
    link: "https://chromewebstore.google.com/detail/snag-for-audius/npejkafkeiijgglcnlggkhjckhochmij",
  },
  {
    title: "audiusKit",
    description:
      "A modern Swift package for integrating Audius music content into your iOS, macOS, tvOS, or watchOS app. AudiusKit provides a type-safe, async/await-based read-only API for accessing and streaming content from the Audius Music catalogue.",
    link: "https://github.com/julianbaker/audiusKit",
  },
  {
    title: "MixSpace",
    description:
      "MixSpace is a nostalgic social music community powered by the Open Audio Protocol. Discover independent artists, find your scene, and stream free music.",
    link: "https://mix.space",
  },
  {
    title: "Aura AI",
    description:
      "AURA AI is a decentralized audio hub built on Audius and Solana. It uses AI to profile each track's energy signature, visualizing it as on-chain vibe maps and creating adaptive playlists.",
    link: "https://dev.fun/app/9a6e0d4a6261b42e7b1b",
    repository: "https://github.com/Radiotomy/Aura-AI",
  },
  {
    title: "BASE Station",
    description:
      "BASE Station is decentralized music streaming with AI-powered vibe check. Stream unlimited music from Audius with professional audio control including a 5-band equalizer and real-time spectrum visualizer.",
    link: "https://ohara.ai/mini-apps/a378aed8-c724-4ddb-93ae-99c8bd084919",
    repository: "https://github.com/Radiotomy/BASE-Station",
  },
  {
    title: "AudioTon",
    description:
      "AudioTon is a Web3 music streaming platform that fuses the Open Audio Protocol's open music ecosystem with TON blockchain's fast, user-friendly infrastructure.",
    link: "https://audioton.co",
    repository: "https://github.com/Radiotomy/ton-aurora-flow",
  },
  {
    title: "AudioBASE",
    description:
      "AudioBASE is a Web3 music streaming platform that bridges the gap between decentralized music (Audius) and Web3 monetization on the BASE blockchain.",
    link: "https://audiobase.co",
    repository: "https://github.com/Radiotomy/audius-base-harmony",
  },
];

export default projects;
