import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReadContract, useWriteContract, useAccount, usePublicClient } from 'wagmi';
import { toast } from 'react-hot-toast';
import { formatEther } from 'viem';
import { CONTRACTS, NFT_ABI, MARKETPLACE_ABI } from '../config/web3';

// Define the shape of the metadata we expect from IPFS
interface NFTMetadata {
  name: string;
  description: string;
  image: string;
}

export default function NFTDetail() {
  const { itemId } = useParams<{ itemId: string }>();
  // Convert itemId to BigInt for contract calls
  const itemIdBigInt = itemId ? BigInt(itemId) : undefined;
  const navigate = useNavigate();
  const { address: account } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [metadataLoading, setMetadataLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);

  // Step 1: Fetch the Market Item using the itemId from the URL
  const { data: marketItem, isLoading: marketItemLoading } = useReadContract({
    address: CONTRACTS.MARKETPLACE_ADDRESS as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'getMarketItem',
    args: itemIdBigInt ? [itemIdBigInt] : undefined,
  });

  // --- CRITICAL DEBUGGING STEP ---
  useEffect(() => {
    if (marketItem) {
      console.log("THE CONTRACT RETURNED THIS OBJECT. Please expand it and take a screenshot:");
      console.dir(marketItem);
    }
  }, [marketItem]);
  // -----------------------------------------

  // Access market item properties by name
  const typedMarketItem = marketItem as any;
  const tokenId = typedMarketItem?.tokenId;
  const tokenIdBigInt = tokenId !== undefined ? BigInt(tokenId) : undefined;

  // Step 2: Fetch the tokenURI using the extracted tokenId
  const { data: tokenURI, isLoading: tokenURILoading } = useReadContract({
    address: CONTRACTS.NFT_ADDRESS as `0x${string}`,
    abi: NFT_ABI,
    functionName: 'tokenURI',
    args: tokenIdBigInt ? [tokenIdBigInt] : undefined,
  });

  // Step 3: Use the tokenURI to fetch the actual metadata (image, name) from IPFS
  useEffect(() => {
    const fetchMetadata = async () => {
      if (!tokenURI) return;
      setMetadataLoading(true);
      const gatewayUrl = (tokenURI as string).replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
      try {
        const response = await fetch(gatewayUrl);
        const data = await response.json();
        setMetadata(data);
      } catch (error) {
        console.error("Failed to fetch metadata", error);
      } finally {
        setMetadataLoading(false);
      }
    };

    fetchMetadata();
  }, [tokenURI]);

  // Handle the "Buy NFT" transaction
  const handleBuy = async () => {
    if (!typedMarketItem) return;
    setIsBuying(true);
    toast.loading("Processing purchase...");
    try {
      // Access price by name
      const price = typedMarketItem.price;
      const buyHash = await writeContractAsync({
        address: CONTRACTS.MARKETPLACE_ADDRESS as `0x${string}`,
        abi: MARKETPLACE_ABI,
        functionName: 'buyNft',
        args: itemIdBigInt ? [itemIdBigInt] : undefined,
        value: price,
        chain: undefined, // Use default chain from wagmi config
        account: account,
      });
      await publicClient!.waitForTransactionReceipt({ hash: buyHash });
      toast.dismiss();
      toast.success("Purchase successful!");
      navigate('/profile');
    } catch (error) {
      console.error("Purchase failed", error);
      toast.dismiss();
      toast.error("Purchase failed.");
    } finally {
      setIsBuying(false);
    }
  };

  const isLoading = marketItemLoading || tokenURILoading || metadataLoading;

  if (isLoading) {
    return <p className="text-center text-white mt-20">Loading NFT details...</p>;
  }

  // Access 'active' and 'seller' by name
  if (!typedMarketItem || !typedMarketItem.active) {
    return <p className="text-center text-red-400 mt-20">Error: This NFT is not listed or does not exist.</p>;
  }
  
  const { seller, price } = typedMarketItem;
  const isOwner = account === seller;

  return (
    <div className="container mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-12 text-white">
      {/* Image */}
      <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
        {metadata?.image ? (
          <img src={metadata.image} alt={metadata.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><p>Loading Image...</p></div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col space-y-6">
        <h1 className="text-4xl font-bold">{metadata?.name || `NFT #${tokenId?.toString()}`}</h1>
        <p className="text-gray-400">{metadata?.description || "No description available."}</p>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Owner</p>
          <p className="font-mono text-sm break-all">{seller as string}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
          <div>
            <p className="text-sm text-gray-400">Current Price</p>
            <p className="text-3xl font-bold">{formatEther(price as bigint)} ETH</p>
          </div>
          {isOwner ? (
            <button disabled className="w-full py-3 rounded-lg bg-gray-600 text-gray-400 cursor-not-allowed">You are the owner</button>
          ) : (
            <button onClick={handleBuy} disabled={isBuying} className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition duration-300 disabled:opacity-50">
              {isBuying ? "Processing..." : "Buy Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}