# 🗳️ Democrazy

> *Where democracy meets blockchain and Sherry makes it sweet!* 🍒

## 🎯 What is this magical thing?

Welcome to the most democratic corner of the blockchain! This is a **community governance platform** where anyone can submit proposals and the community votes on them. Think of it as Twitter polls, but on steroids and with actual consequences! 

**Powered by [Sherry Social](https://sherry.social)** - because voting should be as smooth as your morning coffee ☕

---

## ✨ Features That'll Make You Go "Wow!"

### 📝 **Proposal Creation**
- Got a brilliant idea? Submit it to the blockchain!
- Every proposal gets a unique ID (like a VIP pass)
- Stored forever on Avalanche Fuji (because permanence is cool)

### 🗳️ **Democratic Voting**
- **👍 Upvote** if you love it
- **👎 Downvote** if you... don't
- One address, one vote (no cheating, Karen!)
- Real-time vote counting because who has time to wait?

### 🎨 **Beautiful UI**
- Minimalistic cards that would make Apple jealous
- Hover effects smoother than butter
- Progress bars that actually make sense
- Mobile-friendly because we're not animals

### 🍒 **Sherry Social Integration** 
**Here's where the magic happens!** 

Instead of building another wallet connector that nobody wants, we use **Sherry Social** to handle all the Web3 complexity:
- Click a proposal → Redirects to Sherry
- Sherry handles wallet connection, transaction signing, and all that jazz
- Users vote seamlessly without technical headaches
- We focus on the fun stuff, Sherry handles the boring stuff

*It's like having a blockchain butler! 🤵*

---

## 🚀 How It Works (The Simple Version)

1. **Browse Proposals** 📋
   - Open the app, see beautiful proposal cards
   - Each shows vote counts, creator, and approval percentage

2. **Click to Vote** 🖱️
   - Click any proposal card
   - Get redirected to `https://app.sherry.social/action?url=...`
   - Sherry handles everything from there

3. **Vote & Celebrate** 🎉
   - Sherry prompts wallet connection
   - Sign the transaction
   - Your vote is recorded on-chain
   - Democracy wins!

---

## 🔧 Smart Contract Functions

Our contract is simple but powerful:

```solidity
// Create a new proposal
createProposal(string _text) → returns proposalId

// Vote on existing proposal  
vote(uint256 _proposalId, bool _isUpVote)

// Get proposal details
getProposal(uint256 _proposalId) → (text, creator, timestamp, isActive)

// Get vote counts
getVoteCount(uint256 _proposalId) → (upVotes, downVotes)
```

*That's it! Sometimes simple is better than complex* 🤷‍♂️

---

## 🌐 API Endpoints

### `GET /api/proposals`
Returns all active proposals with their juicy details:
```json
{
  "proposals": [
    {
      "id": "0",
      "text": "Make tacos the official food of the blockchain",
      "creator": "0x...",
      "upVotes": 42,
      "downVotes": 3,
      "totalVotes": 45
    }
  ]
}
```

### `GET /api/vote?proposal=ID`
Returns Sherry-compatible metadata for voting interface

### `POST /api/proposal?proposal=TEXT`
Creates a new proposal (also Sherry-compatible)

---

## 🔥 Why This Rocks

### ✅ **No Wallet Hassle**
Thanks to Sherry, users don't need to:
- Install MetaMask extensions
- Figure out network configurations  
- Copy-paste contract addresses
- Decode transaction errors

### ✅ **Just Works™️**
- Click → Vote → Done
- Clean, intuitive interface
- Real blockchain interaction without the complexity

### ✅ **Actually Decentralized**
- Smart contracts on Avalanche Fuji
- No central authority controlling votes
- Transparent and immutable results

---

## 🛠️ Quick Start

1. **Clone & Install**
   ```bash
   git clone <your-repo>
   npm install
   ```

2. **Set Environment Variables**
   ```bash
   SMART_CONTRACT_ADDRESS=0x...
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. **Run It**
   ```bash
   npm run dev
   ```

4. **Create Proposals & Vote!**
   - Open http://localhost:3000
   - See your beautiful governance platform
   - Click proposals to vote via Sherry

---

## 🎪 Fun Facts

- **Built with Next.js 15** because we like living on the edge
- **Styled with TailwindCSS** because life's too short for vanilla CSS
- **Deployed on Avalanche Fuji** because we're environmentally conscious
- **Powered by Sherry Social** because we're smart enough to use existing solutions

---

## 🤝 Contributing

Found a bug? Have an idea? Want to make democracy even more democratic?

1. Fork it 🍴
2. Create your feature branch (`git checkout -b feature/make-voting-cooler`)
3. Commit your changes (`git commit -m 'Add rainbow voting buttons'`)
4. Push to the branch (`git push origin feature/make-voting-cooler`)
5. Create a Pull Request 🚀

---

## 📜 License

MIT License - because sharing is caring and blockchain is for everyone! 

---

## 🙏 Acknowledgments

- **Sherry Social** for making Web3 UX not suck
- **Avalanche** for cheap, fast transactions
- **The Community** for actually caring about governance
- **Coffee** for making this possible ☕

---

*Made with ❤️, ☕, and a healthy dose of "let's make voting fun again!"*

**[Try it live](#) | [Check the contract](#) | [Visit Sherry Social](https://sherry.social)**
