import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts...");

  const artNft = await ethers.deployContract("ArtNFT");
  await artNft.waitForDeployment();
  console.log(`✅ ArtNFT (ERC-721) deployed to: ${artNft.target}`);

  const marketplace = await ethers.deployContract("Marketplace");
  await marketplace.waitForDeployment();
  console.log(`✅ Marketplace deployed to: ${marketplace.target}`);

  console.log("\nDeployment finished! 🎉");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});