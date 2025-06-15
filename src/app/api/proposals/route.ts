import { NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { avalancheFuji } from "viem/chains";
import { abi } from "../../../../contracts/ProposalContract.abi";

const CONTRACT_ADDRESS = (process.env.SMART_CONTRACT_ADDRESS ??
  "0x123") as `0x${string}`;

// Create a public client for reading from the blockchain
const publicClient = createPublicClient({
  chain: avalancheFuji,
  transport: http(),
});

// Helper function to fetch proposal data
const getProposalData = async (proposalId: bigint) => {
  try {
    // Fetch proposal details
    const proposal = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: abi,
      functionName: "getProposal",
      args: [proposalId],
    });

    // Fetch vote counts
    const voteCounts = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: abi,
      functionName: "getVoteCount",
      args: [proposalId],
    });

      return {
    id: proposalId.toString(),
    text: proposal[0],
    creator: proposal[1],
    timestamp: Number(proposal[2]), // Convert BigInt to Number
    isActive: proposal[3],
    upVotes: Number(voteCounts[0]),
    downVotes: Number(voteCounts[1]),
    totalVotes: Number(voteCounts[0]) + Number(voteCounts[1]),
  };
  } catch (error) {
    console.error(`Error fetching proposal ${proposalId}:`, error);
    return null;
  }
};

export const GET = async (): Promise<NextResponse> => {
  try {
    // Log configuration for debugging
    console.log("CONTRACT_ADDRESS:", CONTRACT_ADDRESS);
    console.log("Chain:", avalancheFuji.name);

    // Check if we have a valid contract address
    if (CONTRACT_ADDRESS === "0x123" || CONTRACT_ADDRESS.length < 42) {
      return NextResponse.json({
        error: "Configuration error",
        message: "Smart contract address not properly configured. Please set SMART_CONTRACT_ADDRESS environment variable.",
        contractAddress: CONTRACT_ADDRESS,
      }, { status: 500 });
    }

    // Get the total number of proposals
    console.log("Fetching proposal count...");
    const proposalCount = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: abi,
      functionName: "getProposalCount",
    });

    console.log("Proposal count:", proposalCount);
    const totalProposals = Number(proposalCount);

    if (totalProposals === 0) {
      return NextResponse.json({
        proposals: [],
        total: 0,
        status: "success",
        message: "No proposals found in the contract",
      });
    }

    // Fetch all proposals
    console.log(`Fetching ${totalProposals} proposals...`);
    const proposals = [];
    for (let i = 0; i < totalProposals; i++) {
      console.log(`Fetching proposal ${i}...`);
      const proposalData = await getProposalData(BigInt(i));
      if (proposalData) {
        proposals.push(proposalData);
        console.log(`Proposal ${i} fetched:`, proposalData.text);
      }
    }

    // Sort by timestamp (newest first) and filter active proposals
    const activeProposals = proposals
      .filter((p) => p.isActive)
      .sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

    console.log(`Returning ${activeProposals.length} active proposals`);

    return NextResponse.json({
      proposals: activeProposals,
      total: activeProposals.length,
      status: "success",
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    
    // More detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = {
      error: "Internal server error",
      message: "Failed to fetch proposals",
      details: errorMessage,
      contractAddress: CONTRACT_ADDRESS,
      network: avalancheFuji.name,
    };

    return NextResponse.json(errorDetails, { status: 500 });
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