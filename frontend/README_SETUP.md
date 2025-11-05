# NFT Marketplace - Setup Guide

## Overview

This is a production-ready NFT Marketplace frontend built with React, TypeScript, Vite, and Web3 technologies. The application provides a beautiful, modern interface for discovering, minting, buying, and selling NFTs on the Ethereum blockchain.

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **Web3 Integration**: 
  - wagmi - React hooks for Ethereum
  - viem - TypeScript Ethereum library
  - RainbowKit - Beautiful wallet connection UI
- **UI Components**: Custom components built on Radix UI primitives
- **Routing**: React Router v6
- **State Management**: React Query for async state
- **Notifications**: React Hot Toast

### Design System
- Dark theme with vibrant purple-to-blue gradient accents
- Semantic color tokens defined in `src/index.css`
- Custom button variants and reusable components
- Responsive grid layouts
- Smooth animations and hover effects

## Getting Started

### Prerequisites
- Node.js 18+ and npm installed
- A Web3 wallet (MetaMask recommended)
- (Optional) WalletConnect Project ID for production deployment

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Configure WalletConnect (Optional but recommended):
   - Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create a new project
   - Copy your Project ID
   - Update `src/config/web3.ts` with your Project ID:
```typescript
export const wagmiConfig = getDefaultConfig({
  appName: 'NFT Marketplace',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Replace this
  chains: [sepolia],
  ssr: false,
});
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── Navbar.tsx       # Navigation bar with wallet connection
│   ├── NFTCard.tsx      # NFT display card
│   └── Web3Provider.tsx # Web3 context provider
├── config/
│   └── web3.ts          # Web3 configuration (wagmi, contracts)
├── hooks/
│   └── useMockNFTs.ts   # Mock NFT data hook (replace with real data)
├── pages/               # Route pages
│   ├── Home.tsx         # Landing page
│   ├── Explore.tsx      # NFT gallery
│   ├── NFTDetail.tsx    # Individual NFT page
│   ├── CreateNFT.tsx    # Minting interface
│   ├── Profile.tsx      # User profile
│   └── NotFound.tsx     # 404 page
├── types/
│   └── nft.ts           # TypeScript interfaces
├── index.css            # Design system & global styles
└── App.tsx              # Root component
```

## Features Implemented

### ✅ Core Features
- **Wallet Connection**: RainbowKit integration with support for multiple wallets
- **NFT Gallery**: Responsive grid layout with search functionality
- **NFT Details**: Dedicated page showing metadata, properties, and ownership
- **Minting Interface**: Form for creating new NFTs with image upload and attributes
- **User Profile**: View owned and created NFTs
- **Responsive Design**: Mobile-first approach, works on all devices

### 🎨 Design Features
- Dark theme with purple-blue gradient accents
- Glassmorphic cards with hover effects
- Smooth animations and transitions
- Loading skeletons for better UX
- Toast notifications for user feedback
- Custom button variants using design system

## Next Steps for Production

### 1. Smart Contract Integration

Currently, the app uses mock data. To connect to real smart contracts:

1. **Deploy Your Contracts**:
   - Deploy the NFT (ERC-721) contract
   - Deploy the Marketplace contract
   - Update `src/config/web3.ts` with actual addresses:
```typescript
export const CONTRACTS = {
  NFT_ADDRESS: '0xYourNFTContractAddress',
  MARKETPLACE_ADDRESS: '0xYourMarketplaceAddress',
};
```

2. **Update ABIs**:
   - Replace the simplified ABIs in `src/config/web3.ts` with full ABIs from your compiled contracts

3. **Implement Contract Calls**:
   - Replace mock functions in pages with real wagmi hooks
   - Use `useReadContract` for reading data
   - Use `useWriteContract` for transactions (minting, buying, listing)

Example:
```typescript
import { useWriteContract } from 'wagmi';
import { CONTRACTS, MARKETPLACE_ABI } from '@/config/web3';

const { writeContract } = useWriteContract();

const buyNFT = async () => {
  await writeContract({
    address: CONTRACTS.MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'buyNft',
    args: [nftAddress, tokenId],
    value: parseEther(price),
  });
};
```

### 2. IPFS Integration (Pinata)

For NFT metadata and image storage:

1. **Get Pinata API Keys**:
   - Sign up at [Pinata](https://www.pinata.cloud/)
   - Get your API Key and Secret

2. **Install Pinata SDK**:
```bash
npm install @pinata/sdk
```

3. **Update CreateNFT.tsx**:
```typescript
// In src/pages/CreateNFT.tsx
import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: "example-gateway.mypinata.cloud",
});

const handleSubmit = async () => {
  // Upload image to IPFS
  const imageUpload = await pinata.upload.file(imageFile);
  const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageUpload.IpfsHash}`;
  
  // Create metadata
  const metadata = {
    name: formData.name,
    description: formData.description,
    image: imageUrl,
    attributes: attributes,
  };
  
  // Upload metadata to IPFS
  const metadataUpload = await pinata.upload.json(metadata);
  const tokenURI = `https://gateway.pinata.cloud/ipfs/${metadataUpload.IpfsHash}`;
  
  // Call mint function with tokenURI
  await mintNFT(tokenURI);
};
```

### 3. Backend API (Optional)

For caching and better performance:

1. **Using Lovable Cloud** (Recommended):
   - The platform can provision a Supabase backend automatically
   - Store NFT metadata, cached listings, user favorites
   - Implement webhook endpoints for blockchain events

2. **Alternative: Custom Backend**:
   - Build with Node.js/Express
   - Implement endpoints from the original spec:
     - `GET /api/nfts` - List all NFTs
     - `GET /api/nfts/:tokenId` - Get NFT details
     - `POST /api/nfts` - Cache new NFT after minting
     - `GET /api/users/:address/nfts` - Get user's NFTs

3. **Indexing with The Graph**:
   - Create a subgraph to index blockchain events
   - Query NFT data efficiently
   - Real-time updates when NFTs are minted/sold

### 4. Environment Variables

Create a `.env` file (never commit this):
```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
VITE_PINATA_JWT=your_pinata_jwt
VITE_PINATA_GATEWAY=your_gateway_url
VITE_NFT_CONTRACT_ADDRESS=0x...
VITE_MARKETPLACE_CONTRACT_ADDRESS=0x...
```

Update imports in code:
```typescript
const config = {
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  // ... other env vars
};
```

### 5. Testing & Security

Before going to production:

- [ ] Test all wallet connection flows
- [ ] Test minting on testnet (Sepolia)
- [ ] Test buying/selling flows
- [ ] Verify IPFS uploads work correctly
- [ ] Audit smart contracts
- [ ] Implement rate limiting for IPFS uploads
- [ ] Add error boundaries in React
- [ ] Test on multiple browsers and devices

## Smart Contract Reference

Here's a basic structure for the contracts you'll need to deploy:

### NFT Contract (ERC-721)
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ArtNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    constructor() ERC721("ArtNFT", "ART") Ownable(msg.sender) {}

    function mint(address to, string memory uri) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }
}
```

### Marketplace Contract
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;

    event NFTListed(address indexed nftAddress, uint256 indexed tokenId, address seller, uint256 price);
    event NFTSold(address indexed nftAddress, uint256 indexed tokenId, address seller, address buyer, uint256 price);

    function listNft(address nftAddress, uint256 tokenId, uint256 price) external {
        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(tokenId) == msg.sender, "Not owner");
        require(price > 0, "Price must be > 0");
        
        listings[nftAddress][tokenId] = Listing(msg.sender, price, true);
        emit NFTListed(nftAddress, tokenId, msg.sender, price);
    }

    function buyNft(address nftAddress, uint256 tokenId) external payable nonReentrancy {
        Listing memory listing = listings[nftAddress][tokenId];
        require(listing.active, "Not listed");
        require(msg.value >= listing.price, "Insufficient payment");

        listings[nftAddress][tokenId].active = false;
        
        IERC721(nftAddress).transferFrom(listing.seller, msg.sender, tokenId);
        payable(listing.seller).transfer(msg.value);

        emit NFTSold(nftAddress, tokenId, listing.seller, msg.sender, msg.value);
    }
}
```

## Deployment

### Frontend Deployment (Lovable)
1. Click "Publish" in the Lovable interface
2. Your app will be deployed automatically
3. (Optional) Connect a custom domain in project settings

### Alternative Deployment Options
- **Vercel**: `npm run build` then deploy the `dist` folder
- **Netlify**: Same as Vercel
- **AWS S3 + CloudFront**: Static hosting
- **IPFS**: For fully decentralized hosting

## Resources

- [Lovable Documentation](https://docs.lovable.dev/)
- [wagmi Documentation](https://wagmi.sh/)
- [RainbowKit Documentation](https://www.rainbowkit.com/)
- [Viem Documentation](https://viem.sh/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Pinata Documentation](https://docs.pinata.cloud/)
- [Ethereum Sepolia Testnet Faucet](https://sepoliafaucet.com/)

## Support

For questions and issues:
- [Lovable Discord Community](https://discord.gg/lovable)
- Open an issue in the repository

## License

MIT License - feel free to use this as a starting point for your own NFT marketplace!
