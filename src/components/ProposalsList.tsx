'use client';

import { useState, useEffect } from 'react';

interface Proposal {
  id: string;
  text: string;
  creator: string;
  timestamp: number; // Changed from bigint to number
  isActive: boolean;
  upVotes: number;
  downVotes: number;
  totalVotes: number;
}

interface ProposalsResponse {
  proposals: Proposal[];
  total: number;
  status: string;
}

const ProposalsList = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/proposals');
        
        if (!response.ok) {
          throw new Error('Failed to fetch proposals');
        }

        const data: ProposalsResponse = await response.json();
        setProposals(data.proposals);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, []);

  const handleProposalClick = (proposalId: string) => {
    const voteUrl = `${baseUrl}/api/vote?proposal=${proposalId}`;
    const sherryUrl = `https://app.sherry.social/action?url=${encodeURIComponent(voteUrl)}`;
    window.open(sherryUrl, '_blank');
  };

  const handleCreateProposal = () => {
    const createUrl = `${baseUrl}/api/proposal`;
    const sherryUrl = `https://app.sherry.social/action?url=${encodeURIComponent(createUrl)}`;
    window.open(sherryUrl, '_blank');
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const time = timestamp * 1000; // timestamp is already a number
    const diff = now - time;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getVotePercentage = (upVotes: number, totalVotes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((upVotes / totalVotes) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading proposals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Proposals</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🗳️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Proposals Available</h3>
          <p className="text-gray-600">Be the first to create a proposal!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Proposals</h1>
        <p className="text-gray-600">Vote on community proposals to shape the future</p>
      </div>

      <div className="space-y-4">
        {/* Add New Proposal Button */}
        <div
          onClick={handleCreateProposal}
          className="group bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
        >
          <div className="p-6 flex items-center justify-center min-h-[140px]">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-500 group-hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 group-hover:text-blue-700 transition-colors duration-200">
                Create New Proposal
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Share your idea with the community
              </p>
            </div>
          </div>
        </div>

        {/* Existing Proposals */}
        {proposals.map((proposal) => {
          const votePercentage = getVotePercentage(proposal.upVotes, proposal.totalVotes);
          
          return (
            <div
              key={proposal.id}
              onClick={() => handleProposalClick(proposal.id)}
              className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
                      {proposal.text}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>by {truncateAddress(proposal.creator)}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(proposal.timestamp)}</span>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {proposal.totalVotes} vote{proposal.totalVotes !== 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-500">
                      {votePercentage}% approval
                    </div>
                  </div>
                </div>

                {/* Vote Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>👍 {proposal.upVotes}</span>
                    <span>👎 {proposal.downVotes}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${votePercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Hint */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Active</span>
                  </div>
                  <div className="text-sm text-blue-600 group-hover:text-blue-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Click to vote →
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="mt-8 text-center">
        <p className="text-gray-500">
          Showing {proposals.length} active proposal{proposals.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default ProposalsList; 