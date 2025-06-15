import { NextRequest, NextResponse } from "next/server";
import {
  createMetadata,
  ExecutionResponse,
  Metadata,
  ValidatedMetadata,
} from "@sherrylinks/sdk";
import {
  encodeFunctionData,
  type TransactionSerializable,
  createPublicClient,
  http,
} from "viem";
import { avalancheFuji } from "viem/chains";
import { serialize } from "wagmi";
import { abi } from "../../../../contracts/ProposalContract.abi";

const CONTRACT_ADDRESS = (process.env.SMART_CONTRACT_ADDRESS ??
  "0x123") as `0x${string}`;

// Create a public client for reading from the blockchain
const publicClient = createPublicClient({
  chain: avalancheFuji,
  transport: http(),
});

// Helper function to fetch proposal data from blockchain
const getProposalData = async (proposalId: string) => {
  try {
    const proposalIdBigInt = BigInt(proposalId);

    // Fetch proposal details
    const proposal = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: abi,
      functionName: "getProposal",
      args: [proposalIdBigInt],
    });

    // Fetch vote counts
    const voteCounts = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: abi,
      functionName: "getVoteCount",
      args: [proposalIdBigInt],
    });

    return {
      text: proposal[0],
      creator: proposal[1],
      timestamp: proposal[2],
      isActive: proposal[3],
      upVotes: voteCounts[0],
      downVotes: voteCounts[1],
    };
  } catch (error) {
    console.error("Error fetching proposal data:", error);
    return null;
  }
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const host = req.headers.get("host") || "localhost:3000";
  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const serverUrl = `${protocol}://${host}`;

  const { searchParams } = new URL(req.url);
  const proposalId = searchParams.get("proposal");

  // Validate proposalId parameter
  if (!proposalId) {
    return NextResponse.json(
      {
        error: "Missing required parameter",
        message: "The 'proposalId' query parameter is required",
      },
      { status: 400 }
    );
  }

  try {
    // Fetch proposal data from blockchain to get the title and vote counts
    const proposalData = await getProposalData(proposalId);

    if (!proposalData) {
      return NextResponse.json(
        {
          error: "Proposal not found",
          message: `Proposal with ID ${proposalId} does not exist`,
        },
        { status: 404 }
      );
    }

    const metadata: Metadata = {
      url: "https://sherry.social",
      baseUrl: serverUrl,
      icon: `${process.env.NEXT_PUBLIC_BASE_URL}/vote-bg.jpg`,
      title: `Proposal: ${proposalData.text}`,
      description: `Vote on this proposal - Current votes: ${Number(
        proposalData.upVotes
      )} up, ${Number(proposalData.downVotes)} down`,
      actions: [
        {
          type: "blockchain",
          label: "Vote Up 👍",
          address: CONTRACT_ADDRESS,
          abi: abi,
          functionName: "vote",
          chains: { source: "fuji" },
          params: [
            {
              name: "_proposalId",
              label: proposalId,
              type: "uint256",
              value: proposalId,
              required: true,
              description: "The ID of the proposal to vote for",
            },
            {
              name: "_isUpVote",
              label: "Up Vote",
              type: "boolean",
              value: true,
              required: true,
              description: "Vote up for this proposal",
            },
          ],
        },
        {
          type: "blockchain",
          label: "Vote Down 👎",
          address: CONTRACT_ADDRESS,
          abi: abi,
          functionName: "vote",
          chains: { source: "fuji" },
          params: [
            {
              name: "_proposalId",
              label: proposalId,
              type: "uint256",
              value: proposalId,
              required: true,
              description: "The ID of the proposal to vote for",
            },
            {
              name: "_isUpVote",
              label: "Down Vote",
              type: "boolean",
              value: false,
              required: true,
              description: "Vote down for this proposal",
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

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(req.url);
    const proposalId = searchParams.get("proposalId");
    const isUpVote = searchParams.get("isUpVote");

    // Validation
    if (!proposalId) {
      return NextResponse.json(
        {
          error: "Missing required parameter",
          message: "The 'proposalId' query parameter is required",
        },
        { status: 400 }
      );
    }

    if (isUpVote === null) {
      return NextResponse.json(
        {
          error: "Missing required parameter",
          message: "The 'isUpVote' query parameter is required (true/false)",
        },
        { status: 400 }
      );
    }

    const isUpVoteBool = isUpVote === "true";
    const proposalIdBigInt = BigInt(proposalId);

    // Verify proposal exists and is active
    const proposalData = await getProposalData(proposalId);
    if (!proposalData) {
      return NextResponse.json(
        {
          error: "Proposal not found",
          message: `Proposal with ID ${proposalId} does not exist`,
        },
        { status: 404 }
      );
    }

    if (!proposalData.isActive) {
      return NextResponse.json(
        {
          error: "Proposal inactive",
          message: "This proposal is no longer active for voting",
        },
        { status: 400 }
      );
    }

    // Prepare vote transaction
    const data = encodeFunctionData({
      abi: abi,
      functionName: "vote",
      args: [proposalIdBigInt, isUpVoteBool],
    });

    const transactionData: TransactionSerializable = {
      to: CONTRACT_ADDRESS,
      data: data,
      chainId: avalancheFuji.id,
      type: "legacy",
    };

    const serialized = serialize(transactionData);

    const responseData: ExecutionResponse = {
      serializedTransaction: serialized,
      chainId: avalancheFuji.name,
    };

    console.log(
      `Vote transaction prepared: Proposal ${proposalId}, UpVote: ${isUpVoteBool}`
    );

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    });
  } catch (error) {
    console.error("Error preparing vote transaction:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to prepare vote transaction",
      },
      { status: 500 }
    );
  }
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
    },
  });
}
