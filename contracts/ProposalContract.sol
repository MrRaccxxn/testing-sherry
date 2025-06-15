// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProposalContract {
    struct Proposal {
        string text;
        address creator;
        uint256 timestamp;
        bool isActive;
    }

    // State variables
    Proposal[] public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => uint256) public upVotes;
    mapping(uint256 => uint256) public downVotes;

    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed creator,
        string text
    );
    event Voted(
        uint256 indexed proposalId,
        address indexed voter,
        bool isUpVote
    );

    // Errors
    error AlreadyVoted();
    error InvalidProposalId();
    error ProposalNotActive();

    /**
     * @notice Creates a new proposal
     * @param _text The text content of the proposal
     * @return proposalId The ID of the newly created proposal
     */
    function createProposal(string memory _text) external returns (uint256) {
        uint256 proposalId = proposals.length;

        proposals.push(
            Proposal({
                text: _text,
                creator: msg.sender,
                timestamp: block.timestamp,
                isActive: true
            })
        );

        emit ProposalCreated(proposalId, msg.sender, _text);
        return proposalId;
    }

    /**
     * @notice Votes on a proposal
     * @param _proposalId The ID of the proposal to vote on
     * @param _isUpVote True for upvote, false for downvote
     */
    function vote(uint256 _proposalId, bool _isUpVote) external {
        if (_proposalId >= proposals.length) revert InvalidProposalId();
        if (!proposals[_proposalId].isActive) revert ProposalNotActive();
        if (hasVoted[_proposalId][msg.sender]) revert AlreadyVoted();

        hasVoted[_proposalId][msg.sender] = true;

        if (_isUpVote) {
            upVotes[_proposalId]++;
        } else {
            downVotes[_proposalId]++;
        }

        emit Voted(_proposalId, msg.sender, _isUpVote);
    }

    /**
     * @notice Gets the details of a proposal
     * @param _proposalId The ID of the proposal to get
     * @return text The proposal text
     * @return creator The creator's address
     * @return timestamp The creation timestamp
     * @return isActive The proposal status
     */
    function getProposal(
        uint256 _proposalId
    )
        external
        view
        returns (
            string memory text,
            address creator,
            uint256 timestamp,
            bool isActive
        )
    {
        if (_proposalId >= proposals.length) revert InvalidProposalId();

        Proposal memory proposal = proposals[_proposalId];
        return (
            proposal.text,
            proposal.creator,
            proposal.timestamp,
            proposal.isActive
        );
    }

    /**
     * @notice Gets the vote counts for a proposal
     * @param _proposalId The ID of the proposal to get vote counts for
     * @return upVoteCount The number of upvotes
     * @return downVoteCount The number of downvotes
     */
    function getVoteCount(
        uint256 _proposalId
    ) external view returns (uint256 upVoteCount, uint256 downVoteCount) {
        if (_proposalId >= proposals.length) revert InvalidProposalId();

        return (upVotes[_proposalId], downVotes[_proposalId]);
    }

    /**
     * @notice Gets the total number of proposals
     * @return The total number of proposals
     */
    function getProposalCount() external view returns (uint256) {
        return proposals.length;
    }
}
