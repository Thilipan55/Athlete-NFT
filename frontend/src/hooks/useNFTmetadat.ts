// In frontend/src/hooks/useNFTMetadata.ts

import { useState, useEffect } from 'react';

// Defines the shape of the metadata we expect from IPFS
interface NFTMetadata {
    name: string;
    description: string;
    image: string;
    attributes?: Array<{ trait_type: string; value: string | number }>;
}

// Hook to fetch the human-readable metadata from an IPFS URL
export const useNFTMetadata = (tokenURI: string | undefined) => {
    const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!tokenURI || tokenURI.startsWith('0x')) { // Check for valid URI format
            setIsLoading(false);
            return;
        }

        // Convert the IPFS link to an HTTP gateway link (Pinata's public gateway)
        const gatewayUrl = tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');

        const fetchMetadata = async () => {
            try {
                const response = await fetch(gatewayUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: NFTMetadata = await response.json();
                setMetadata(data);
            } catch (error) {
                console.error("Failed to fetch NFT metadata:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        setIsLoading(true);
        fetchMetadata();
    }, [tokenURI]);

    return { metadata, isLoading, isError };
};