import { useState, useEffect } from 'react'; // Keep useEffect if you still have logs
import { useAccount } from 'wagmi';
import { useReadContract } from 'wagmi';
import { Link } from 'react-router-dom';
import { CONTRACTS, MARKETPLACE_ABI } from '../config/web3';
import NFTCard from '../components/NFTCard';

export default function Profile() {
  const { address: account, isConnected } = useAccount();
  // No need for activeTab state if there's only one tab

  console.log("Profile Page Rendered. Connected Account:", account);

  // Fetch NFTs created by the connected user
  const {
    data: createdItemsData,
    isLoading: isLoadingCreated,
    isError: isErrorCreated,
    error
  } = useReadContract({
    address: CONTRACTS.MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'fetchItemsCreated',
    args: [account],
    enabled: isConnected && !!account,
  });

  // Log data and errors
  useEffect(() => {
    // ... (keep your console logs if you want) ...
  }, [createdItemsData, isLoadingCreated, isErrorCreated, error]);

  const createdItems = (Array.isArray(createdItemsData) ? createdItemsData : []) as any[];
  const createdCount = createdItems.length;

  if (!isConnected) {
    return <p className="text-center text-white mt-20">Please connect your wallet.</p>;
  }

  return (
    <div className="container mx-auto p-8 text-white">
      {/* Profile Header */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <div className="font-mono text-sm text-gray-400 break-all mt-2">{account}</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
          {/* You can remove the "Owned" count display here too if you like */}
          <div><p className="text-2xl font-bold">0</p><p className="text-gray-400">Owned</p></div>
          <div><p className="text-2xl font-bold">{createdCount}</p><p className="text-gray-400">Created</p></div>
          <div><p className="text-2xl font-bold">0</p><p className="text-gray-400">Sales</p></div>
          <div><p className="text-2xl font-bold">0.0</p><p className="text-gray-400">Volume (ETH)</p></div>
        </div>
      </div>

      {/* Simplified Tab Section (or remove entirely) */}
      <div className="border-b border-gray-700 mb-8">
         {/* Only show the Created tab button */}
        <button
          className={`py-2 px-4 border-b-2 border-purple-500`} // Always active style
        >
          Created ({createdCount})
        </button>
      </div>

      {/* NFT Grid - Always show created items */}
      <>
        {isLoadingCreated && <p className="text-center">Loading your created NFTs...</p>}
        {!isLoadingCreated && isErrorCreated && <p className="text-center text-red-400">Error loading created NFTs. Check console.</p>}
        {!isLoadingCreated && !isErrorCreated && createdItems.length === 0 && (
          <div className="text-center text-gray-400">
            <p>You haven't listed any NFTs for sale yet.</p>
            <Link to="/create" className="text-purple-400 hover:underline">Create one now!</Link>
          </div>
        )}
        {!isLoadingCreated && !isErrorCreated && createdItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {createdItems.map((item, index) => (
               item && item.itemId ?
                 <NFTCard key={`${item.itemId?.toString()}-${index}`} item={item} /> :
                 <p key={`invalid-${index}`} className='text-red-500'>Invalid Item Data</p>
            ))}
          </div>
        )}
      </>

      {/* REMOVED the Owned Tab Content */}

    </div>
  );
}