import { useState, useEffect } from 'react';
import { NFT } from '@/types/nft';

// Mock NFT data for demonstration
const MOCK_NFTS: NFT[] = [
  {
    tokenId: '1',
    name: 'Cosmic Dreams #001',
    description: 'A mesmerizing journey through the cosmos, captured in digital art.',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&h=600&fit=crop',
    price: '2.5',
    owner: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    listed: true,
    attributes: [
      { trait_type: 'Type', value: 'Space' },
      { trait_type: 'Rarity', value: 'Legendary' },
      { trait_type: 'Color Scheme', value: 'Purple' },
    ],
  },
  {
    tokenId: '2',
    name: 'Digital Zen #042',
    description: 'Find peace in the digital realm with this abstract masterpiece.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop',
    price: '1.8',
    owner: '0x1234567890123456789012345678901234567890',
    creator: '0x1234567890123456789012345678901234567890',
    listed: true,
    attributes: [
      { trait_type: 'Type', value: 'Abstract' },
      { trait_type: 'Rarity', value: 'Rare' },
      { trait_type: 'Color Scheme', value: 'Blue' },
    ],
  },
  {
    tokenId: '3',
    name: 'Neon Nights #888',
    description: 'Vibrant neon colors illuminate the digital darkness.',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&h=600&fit=crop',
    price: '3.2',
    owner: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    creator: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    listed: true,
    attributes: [
      { trait_type: 'Type', value: 'Cyberpunk' },
      { trait_type: 'Rarity', value: 'Epic' },
      { trait_type: 'Color Scheme', value: 'Neon' },
    ],
  },
  {
    tokenId: '4',
    name: 'Crystal Formations #256',
    description: 'Geometric perfection meets natural beauty in crystal form.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=600&fit=crop',
    price: '1.5',
    owner: '0x9876543210987654321098765432109876543210',
    creator: '0x9876543210987654321098765432109876543210',
    listed: true,
    attributes: [
      { trait_type: 'Type', value: 'Geometric' },
      { trait_type: 'Rarity', value: 'Uncommon' },
      { trait_type: 'Color Scheme', value: 'Crystal' },
    ],
  },
  {
    tokenId: '5',
    name: 'Abstract Waves #777',
    description: 'Flowing digital waves create a hypnotic visual experience.',
    image: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=600&h=600&fit=crop',
    price: '2.0',
    owner: '0x5555555555555555555555555555555555555555',
    creator: '0x5555555555555555555555555555555555555555',
    listed: true,
    attributes: [
      { trait_type: 'Type', value: 'Abstract' },
      { trait_type: 'Rarity', value: 'Rare' },
      { trait_type: 'Color Scheme', value: 'Rainbow' },
    ],
  },
  {
    tokenId: '6',
    name: 'Future Vision #2077',
    description: 'A glimpse into the digital future of art and technology.',
    image: 'https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?w=600&h=600&fit=crop',
    price: '4.5',
    owner: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    creator: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    listed: true,
    attributes: [
      { trait_type: 'Type', value: 'Futuristic' },
      { trait_type: 'Rarity', value: 'Legendary' },
      { trait_type: 'Color Scheme', value: 'Blue' },
    ],
  },
];

/**
 * Custom hook for mock NFT data
 * In production, this would fetch from smart contracts and backend API
 */
export const useMockNFTs = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setNfts(MOCK_NFTS);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getNFTById = (tokenId: string): NFT | undefined => {
    return nfts.find((nft) => nft.tokenId === tokenId);
  };

  const getNFTsByOwner = (owner: string): NFT[] => {
    return nfts.filter((nft) => nft.owner.toLowerCase() === owner.toLowerCase());
  };

  const getNFTsByCreator = (creator: string): NFT[] => {
    return nfts.filter((nft) => nft.creator.toLowerCase() === creator.toLowerCase());
  };

  return {
    nfts,
    loading,
    getNFTById,
    getNFTsByOwner,
    getNFTsByCreator,
  };
};
