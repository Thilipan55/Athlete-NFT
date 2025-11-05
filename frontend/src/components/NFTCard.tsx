import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useReadContract } from 'wagmi';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CONTRACTS, NFT_ABI } from '@/config/web3';
import { formatEther } from 'viem';

interface NFTCardProps {
  item: any;
}

const NFTCard = ({ item }: NFTCardProps) => {
  // --- THIS IS THE CRITICAL SAFETY CHECK ---
  // If the item from the props is invalid, render nothing and prevent a crash.
  if (!item || typeof item.tokenId === 'undefined') {
    return null; 
  }
  // -----------------------------------------

  const [metadata, setMetadata] = useState<{ name: string; image: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const tokenId = item.tokenId;

  // Fetch the tokenURI (IPFS link) from the ArtNFT contract
  const { data: tokenURI } = useReadContract({
    address: CONTRACTS.NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'tokenURI',
    args: [tokenId],
    enabled: tokenId !== undefined,
  });

  // Fetch the final metadata (name, image) from IPFS
  useEffect(() => {
    const fetchMetadata = async () => {
      if (!tokenURI) return;
      setIsLoading(true);
      const gatewayUrl = (tokenURI as string).replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
      try {
        const response = await fetch(gatewayUrl);
        const data = await response.json();
        setMetadata(data);
      } catch (error) {
        console.error("Failed to fetch metadata for card:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetadata();
  }, [tokenURI]);

  // Prepare data for display with safe fallbacks
  const name = isLoading ? 'Loading...' : metadata?.name || `NFT #${item.tokenId.toString()}`;
  const image = isLoading ? '/placeholder.svg' : metadata?.image || '/placeholder.svg';
  const price = formatEther(item.price as bigint);
  const owner = item.seller;
  const shortOwner = `${owner.slice(0, 6)}...${owner.slice(-4)}`;

  return (
    // Use the itemId for the link to the detail page
    <Link to={`/nft/${item.itemId.toString()}`}>
      <Card className="overflow-hidden border-border bg-gradient-card card-hover cursor-pointer">
        <div className="aspect-square relative overflow-hidden bg-secondary">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <Badge className="absolute top-2 right-2 bg-primary/90 text-primary-foreground">
            Listed
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 truncate">{name}</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="text-lg font-bold text-primary">{price} ETH</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Owner</p>
              <p className="text-xs font-mono">{shortOwner}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NFTCard;