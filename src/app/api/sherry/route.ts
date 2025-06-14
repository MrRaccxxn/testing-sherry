import { NextRequest, NextResponse } from "next/server";
import { createMetadata, Metadata } from "@sherrylinks/sdk";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const host = req.headers.get("host") || "localhost:3000";
  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const serverUrl = `${protocol}://${host}`;

  const metadata: Metadata = {
    url: "https://sherry.social",
    baseUrl: serverUrl,
    icon: `${process.env.PUBLIC_URL}/vote.png`,
    title: "Mint Cosmic NFT",
    description: "Mint exclusive NFTs directly from social media",
    actions: [
      {
        type: "dynamic",
        label: "Binary Public Voting Feed",
        description: "Vote on the latest public voting feed",
        chains: { source: "fuji" },
        path: "/api/sherry",
        params: [
          {
            name: "selectedCandidate",
            label: "Select your Candidate",
            type: "select",
            options: [
              { label: "Candidate 1", value: "candidate1" },
              { label: "Candidate 2", value: "candidate2" },
              { label: "Candidate 3", value: "candidate3" },
            ],
          },
        ],
      },
    ],
  };

  const validated = createMetadata(metadata);

  if (!validated) {
    return NextResponse.json({ error: "Invalid metadata" }, { status: 400 });
  }

  return NextResponse.json(metadata, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
