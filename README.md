# AthleteNFT: A Full-Stack NFT Marketplace

**AthleteNFT** is a complete, full-stack decentralized application (dApp) built on the **Ethereum blockchain**.  
It provides a user-friendly web interface for users to mint, view, list for sale, and purchase unique digital collectibles (NFTs).

This project demonstrates the **end-to-end flow** of a modern Web3 application — from **smart contract deployment** to a **responsive frontend** hosted on a global edge network.

---

## Core Features

- **NFT Minting:** Create new, unique ERC-721 tokens by uploading an image, name, description, and price.  
- **Decentralized Storage:** NFT images and metadata are uploaded to **IPFS** via **Pinata**, ensuring permanence and decentralization.  
  The blockchain stores only the immutable IPFS link (Token URI).
- **Marketplace:** List your NFTs for sale on a public marketplace.  
- **Buying & Selling:** Purchase listed NFTs via atomic swaps — NFTs are securely transferred to the buyer, and ETH to the seller.  
- **User Profiles:** View all NFTs a user has created and listed for sale.  
- **Wallet Integration:** Connect securely to MetaMask using **`wagmi`** hooks for blockchain interactions.

---

## Technology Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | React (Vite), TypeScript, Tailwind CSS |
| **Web3 Libraries** | `wagmi`, `viem` |
| **Smart Contracts** | Solidity |
| **Development Environment** | Hardhat |
| **Blockchain** | Ethereum (Sepolia Testnet / Local Hardhat Node) |
| **Wallet** | MetaMask |
| **Storage** | IPFS via Pinata |
| **Deployment** | Vercel / Netlify |

---

## System Architecture

AthleteNFT is composed of **three main parts**:

### 1. Smart Contracts (`smart-contracts` folder)
- The **core logic** of the app, written in **Solidity**.
- Deployed on the blockchain — the ultimate source of truth.
- **Contracts:**
  - `ArtNFT.sol` → Handles **minting** and **ownership tracking** of NFTs.
  - `Marketplace.sol` → Manages **listing**, **buying**, and **fund transfers**.

### 2. Frontend (`frontend` folder)
- A **React-based website** where users interact with the blockchain.
- Reads on-chain data (e.g., listed NFTs) and sends write transactions via MetaMask.

### 3. IPFS (Storage Layer)
- Images and metadata (`.json` files) are stored on **IPFS** via **Pinata**.
- Smart contracts store only the **Token URI** pointing to IPFS.

---

## Getting Started (Local Development)

Follow these steps to set up and run the full project locally.

> You’ll need two terminal windows — one for the blockchain and one for the frontend.

---

### Prerequisites

Make sure you have installed:

- [Node.js (v18+)](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [MetaMask](https://metamask.io/)

---

### Step 1: Clone the Repository

```bash
https://github.com/Thilipan55/Athlete-NFT
cd Athlete-NFT
```
### Step 2:
```bash
cd smart-contracts
npm install
npx hardhat compile
npx hardhat node
```
### Step 3: Deploy Contracts
```bash
cd smart-contracts
npx hardhat run scripts/deploy.ts --network localhost
```

