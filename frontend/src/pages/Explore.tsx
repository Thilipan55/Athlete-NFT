import { useReadContract } from 'wagmi';
import { CONTRACTS, MARKETPLACE_ABI } from '../config/web3';
import NFTCard from '@/components/NFTCard';

export default function Explore() {
  const { data: marketItems, isLoading } = useReadContract({
    address: CONTRACTS.MARKETPLACE_ADDRESS as `0x${string}`,
    abi: MARKETPLACE_ABI,
    functionName: 'fetchAllMarketItems',
  });

  if (isLoading) {
    return <p className="text-center mt-20 text-white">Loading NFTs from the blockchain...</p>;
  }

  const items = marketItems as any[] || [];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Explore Listings ({items.length})</h1>
      {items.length === 0 ? (
        <p className="text-center text-gray-400">No NFTs are currently listed for sale.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {items.map((item) => (
            <NFTCard key={item.itemId.toString()} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}