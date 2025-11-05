import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, TrendingUp, Shield } from 'lucide-react';
import NFTCard from '@/components/NFTCard';
import { useMockNFTs } from '@/hooks/useMockNFTs';
import { Skeleton } from '@/components/ui/skeleton';

const Home = () => {
  const { nfts, loading } = useMockNFTs();
  const featuredNFTs = nfts.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Discover, Collect & Sell
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Extraordinary NFTs
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The world's leading NFT marketplace for digital art and collectibles.
            Connect your wallet and start your journey.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/explore">
              <Button variant="hero" size="lg" className="gap-2">
                Explore NFTs
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/create">
              <Button variant="outline" size="lg" className="gap-2">
                Create NFT
                <Sparkles className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Marketplace</h3>
              <p className="text-muted-foreground">
                Built on Ethereum with battle-tested smart contracts
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Minting</h3>
              <p className="text-muted-foreground">
                Create and mint your NFTs with just a few clicks
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Low Fees</h3>
              <p className="text-muted-foreground">
                Competitive marketplace fees and transparent pricing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured NFTs */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured NFTs</h2>
            <Link to="/explore">
              <Button variant="ghost" className="gap-2">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredNFTs.map((nft) => (
                <NFTCard key={nft.tokenId} nft={nft} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-card border border-border rounded-2xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Ready to Start Your Collection?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of creators and collectors in the NFT revolution
              </p>
              <Link to="/explore">
                <Button variant="hero" size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
