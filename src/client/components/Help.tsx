import { Flex, Text } from "@audius/harmony";

// Array of SVG badge files
const badgeFiles = [
  "badgePoweredByAudiusLight.svg",
  "badgeBuiltWithAudiusLight.svg",
  "badgeStreamingFromAudiusLight.svg",
  "badgePoweredByAudiusDark.svg",
  "badgeBuiltWithAudiusDark.svg",
  "badgeStreamingFromAudiusDark.svg",
];

const Help = () => {
  // Function to handle badge click and download the zip file
  const handleBadgeClick = () => {
    // Create a temporary anchor element to trigger the download
    const link = document.createElement("a");
    link.href = "/static/Developer Badges.zip";
    link.download = "Developer Badges.zip";
    link.setAttribute("download", "Developer Badges.zip");
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up
    document.body.removeChild(link);
  };

  return (
    <Flex direction="column" className="py-4">
      <Text variant="heading" className="mb-4">
        Create The Future of Music, Together.
      </Text>

      <div className="mb-4 text-[13px]">
        <a
          href="https://audius.community"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2200C1] underline"
        >
          audius.community
        </a>{" "}
        is a glossary of community projects built on the Open Audio Protocol,
        using Audius APIs.
      </div>

      <div className="mb-6 text-[13px]">
        To add your project and get free hosting or a redirect, submit an issue
        on{" "}
        <a
          href="https://github.com/AudiusProject/audius.community/issues/new?template=audius-community-listing.yml"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2200C1] underline"
        >
          GitHub.
        </a>
      </div>

      <div className="mb-1 text-[13px]">
        Send this to your AI agent to get started!
      </div>
      <div className="mb-4 rounded border border-[#ebebeb] bg-[#f8f8f8] p-4 font-mono text-[13px]">
        <div className="text-[#555]">
          &gt; Read https://audius.co/agents.md and follow the instructions to
          build with the Audius developer docs.
        </div>
      </div>

      {/* Developer Badges Section */}
      <Text variant="heading" size="s" className="mb-2">
        Developer Badges
      </Text>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {badgeFiles.map((badge, index) => (
          <div
            key={index}
            className="border border-[#ebebeb] rounded p-3 flex items-center justify-center cursor-pointer hover:bg-[#f8f8f8]"
            onClick={handleBadgeClick}
          >
            <img
              src={`/static/Developer Badges/${badge}`}
              alt={`Audius Developer Badge - ${badge}`}
              className="max-h-[50px] w-auto"
            />
          </div>
        ))}
      </div>

      <Text variant="heading" size="s" className="mb-2">
        Useful Links
      </Text>
      <ul className="list-disc pl-5 mb-4">
        <li className="mb-1 text-[13px]">
          <a
            href="https://audius.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2200C1] underline"
          >
            audius.co
          </a>
        </li>
        <li className="mb-1 text-[13px]">
          <a
            href="https://openaudio.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2200C1] underline"
          >
            openaudio.org
          </a>
        </li>
        <li className="mb-1 text-[13px]">
          <a
            href="https://docs.audius.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2200C1] underline"
          >
            docs.audius.co
          </a>
        </li>
        <li className="mb-1 text-[13px]">
          <a
            href="https://audius.co/agents.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2200C1] underline"
          >
            agent files
          </a>
        </li>
      </ul>

      <Text size="s" className="mt-8">
        This site is built on vibes 💫🪐✨💿
      </Text>
    </Flex>
  );
};

export default Help;
