import { NextRequest, NextResponse } from "next/server";
import { createMetadata, Metadata, ValidatedMetadata } from "@sherrylinks/sdk";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const host = req.headers.get("host") || "localhost:3000";
  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const serverUrl = `${protocol}://${host}`;

  try {
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

    const validated: ValidatedMetadata = createMetadata(metadata);

    if (!validated) {
      return NextResponse.json({ error: "Invalid metadata" }, { status: 400 });
    }

    return NextResponse.json(validated, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    });
  } catch (error) {
    console.error("Error creating metadata:", error);
    return NextResponse.json(
      { error: "Error creating metadata" },
      { status: 500 }
    );
  }
};

export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 204, // Sin Contenido
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
    },
  });
}
