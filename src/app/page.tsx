import ProposalsList from '@/components/ProposalsList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🗳️ Community Governance
          </h1>
          <p className="text-lg text-gray-600">
            Vote on proposals and shape the future of our community
          </p>
        </div>
        
        <ProposalsList />
      </div>
    </div>
  );
}
