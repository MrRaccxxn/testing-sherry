import { NextRequest, NextResponse } from "next/server";
import {
  createMetadata,
  ExecutionResponse,
  Metadata,
  ValidatedMetadata,
} from "@sherrylinks/sdk";
import { encodeFunctionData, type TransactionSerializable } from "viem";
import { avalancheFuji } from "viem/chains";
import { abi } from "../../../../contracts/ProposalContract.abi";
import { serialize } from "wagmi";

const CONTRACT_ADDRESS = (process.env.SMART_CONTRACT_ADDRESS ??
  "0x123") as `0x${string}`;

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const host = req.headers.get("host") || "localhost:3000";
  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const serverUrl = `${protocol}://${host}`;

  console.log("serverUrl", process.env.NEXT_PUBLIC_BASE_URL);

  try {
    const metadata: Metadata = {
      url: "https://sherry.social",
      baseUrl: serverUrl,
      icon: `${process.env.NEXT_PUBLIC_BASE_URL}/proposal-bg.jpg`,
      title: "Proposal",
      description: "Submit a proposal to the public voting feed",
      actions: [
        {
          type: "dynamic",
          label: "Submit Proposal",
          description: "Submit a proposal for the public voting feed",
          chains: { source: "fuji" },
          path: "/api/proposal",
          params: [
            {
              name: "proposal",
              label: "Your Proposal",
              type: "text",
              value: "",
              required: true,
              description: "The proposal you want to submit",
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
    // Extract query parameters using Next.js best practices
    const { searchParams } = new URL(req.url);
    const proposal = searchParams.get("proposal");

    // Validation: Check if proposal parameter exists
    if (!proposal) {
      return NextResponse.json(
        {
          error: "Missing required parameter",
          message: "The 'proposal' query parameter is required",
        },
        { status: 400 }
      );
    }

    // Log the received proposal for debugging
    console.log("POST request received with proposal:", proposal);

    // Smart contract interaction - Create proposal
    const data = encodeFunctionData({
      abi: abi,
      functionName: "createProposal",
      args: [proposal.trim()],
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

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      },
    });
  } catch (error) {
    console.error("Error processing proposal:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to process the proposal",
      },
      { status: 500 }
    );
  }
};

export async function OPTIONS() {
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
