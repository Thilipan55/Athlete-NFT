import { useState, FormEvent } from 'react';
import { useWriteContract, useAccount, usePublicClient } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from 'react-hot-toast';
import { CONTRACTS, NFT_ABI, MARKETPLACE_ABI } from '../config/web3';
import { useNavigate } from 'react-router-dom';

export default function CreateNFT() {
  const [formData, setFormData] = useState({ name: '', description: '', price: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { address: account } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!imageFile || !formData.name || !formData.price || !account) {
      toast.error('Please connect wallet, fill all fields, and upload an image.');
      return;
    }
    setIsSubmitting(true);
    let tokenId: bigint | undefined;

    try {
      // Step 1: Upload to IPFS
      toast.loading('Uploading to IPFS...');
      const ipfsData = new FormData();
      ipfsData.append('file', imageFile);
      const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}` },
        body: ipfsData,
      });
      const ipfsResult = await res.json();
      const IpfsHash = ipfsResult.IpfsHash || ipfsResult.ipfsHash;
      if (!IpfsHash) throw new Error("Failed to upload image to IPFS.");
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;

      const metadata = { name: formData.name, description: formData.description, image: imageUrl };
      const metadataRes = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}` },
        body: JSON.stringify(metadata),
      });
      const metadataResult = await metadataRes.json();
      const metadataHash = metadataResult.IpfsHash || metadataResult.ipfsHash;
      if (!metadataHash) throw new Error("Failed to upload metadata to IPFS.");
      const tokenURI = `https://gateway.pinata.cloud/ipfs/${metadataHash}`;
      toast.dismiss();
      
      // Step 2: Mint the NFT
      toast.loading('Minting your NFT... Please confirm in wallet.');
      const mintHash = await writeContractAsync({
  address: CONTRACTS.NFT_ADDRESS as `0x${string}`, 
  abi: NFT_ABI, 
  functionName: 'mint', 
  args: [account, tokenURI],
  chain: undefined, // Use default chain from wagmi config
  account: account,
      });
      const mintReceipt = await publicClient!.waitForTransactionReceipt({ hash: mintHash });
      // ERC721 Transfer event: topics[3] is tokenId
      const log = mintReceipt.logs.find(l => Array.isArray(l.topics) && l.topics.length === 4);
      if (log && log.topics && log.topics[3]) {
        tokenId = BigInt(log.topics[3]);
      } else {
        throw new Error("Could not get tokenId from mint transaction.");
      }
      toast.dismiss();

      // Step 3: Approve the Marketplace
      toast.loading('Approving the marketplace...');
      const approveHash = await writeContractAsync({
  address: CONTRACTS.NFT_ADDRESS as `0x${string}`, 
  abi: NFT_ABI, 
  functionName: 'approve', 
  args: [CONTRACTS.MARKETPLACE_ADDRESS as `0x${string}`, tokenId],
  chain: undefined,
  account: account,
      });
      await publicClient!.waitForTransactionReceipt({ hash: approveHash });
      toast.dismiss();

      // Step 4: List the NFT for sale
      toast.loading('Listing your NFT for sale...');
      const listHash = await writeContractAsync({
  address: CONTRACTS.MARKETPLACE_ADDRESS as `0x${string}`, 
  abi: MARKETPLACE_ABI, 
  functionName: 'listNft', 
  args: [CONTRACTS.NFT_ADDRESS as `0x${string}`, tokenId, parseEther(formData.price)],
  chain: undefined,
  account: account,
      });
      await publicClient!.waitForTransactionReceipt({ hash: listHash });

      toast.dismiss();
      toast.success('Your NFT has been minted and listed successfully!');
      navigate('/explore');

    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error('An error occurred. Check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Create and List a New NFT</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Image Upload */}
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-2">
            Image
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-400">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only"
                    onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                    required
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
              {imageFile && <p className="text-sm text-green-400 pt-2">{imageFile.name}</p>}
            </div>
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="My Awesome NFT"
            className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white focus:ring-purple-500 focus:border-purple-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        {/* Description Input */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="A very cool description for my unique NFT..."
            className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white focus:ring-purple-500 focus:border-purple-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Price Input */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
            Price (ETH)
          </label>
          <input
            id="price"
            type="number"
            step="0.001"
            placeholder="0.1"
            className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white focus:ring-purple-500 focus:border-purple-500"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? 'Processing...' : 'Create and List NFT'}
          </button>
        </div>
      </form>
    </div>
  );
}