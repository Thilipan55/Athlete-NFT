import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster as HotToast } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Web3Provider from "./components/Web3Provider";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import NFTDetail from "./pages/NFTDetail";
import CreateNFT from "./pages/CreateNFT";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const App = () => (
  <Web3Provider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HotToast
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'hsl(240 6% 6%)',
            color: 'hsl(210 40% 98%)',
            border: '1px solid hsl(240 6% 15%)',
          },
        }}
      />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/nft/:itemId" element={<NFTDetail />} />
          <Route path="/create" element={<CreateNFT />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </Web3Provider>
);

export default App;
