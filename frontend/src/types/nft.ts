export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: NFTAttribute[];
}

export interface NFT {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  price: string;
  owner: string;
  creator: string;
  attributes?: NFTAttribute[];
  listed: boolean;
}
