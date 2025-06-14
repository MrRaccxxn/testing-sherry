import { NextResponse } from "next/server";
import { createMetadata, Metadata } from "@sherrylinks/sdk";

export const GET = async (): Promise<NextResponse> => {
  const metadata: Metadata = {
    url: process.env.PUBLIC_URL ?? "",
    icon: "random.png",
    title: "Mint Cosmic NFT",
    description: "Mint exclusive NFTs directly from social media",
    actions: [
      {
        type: "dynamic",
        label: "Binary Public Voting Feed",
        description: "Vote on the latest public voting feed",
        chains: { source: "fuji" },
        path: "/api/vote",
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
