// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool active;
    }

    uint256 private _itemIds;
    mapping(uint256 => MarketItem) private idToMarketItem;

    event NFTListed(uint256 indexed itemId, address indexed nftContract, uint256 indexed tokenId, address seller, uint256 price);
    event NFTSold(uint256 indexed itemId, address indexed nftContract, uint256 indexed tokenId, address seller, address buyer, uint256 price);

    function listNft(address nftAddress, uint256 tokenId, uint256 price) external {
        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(tokenId) == msg.sender, "Not owner");
        require(price > 0, "Price must be > 0");

        _itemIds++;
        uint256 itemId = _itemIds;

        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftAddress,
            tokenId,
            payable(msg.sender),
            price,
            true
        );

        emit NFTListed(itemId, nftAddress, tokenId, msg.sender, price);
    }

    function buyNft(uint256 itemId) external payable nonReentrant {
        MarketItem storage item = idToMarketItem[itemId];
        require(item.active, "Item not listed for sale");
        require(msg.value >= item.price, "Insufficient payment");

        item.active = false;
        
        IERC721(item.nftContract).transferFrom(item.seller, msg.sender, item.tokenId);
        (bool success, ) = item.seller.call{value: msg.value}("");
        require(success, "Transfer failed.");

        emit NFTSold(itemId, item.nftContract, item.tokenId, item.seller, msg.sender, msg.value);
    }

    function fetchAllMarketItems() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds;
        uint256 activeItemCount = 0;
        
        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (idToMarketItem[i].active) {
                activeItemCount++;
            }
        }

        MarketItem[] memory items = new MarketItem[](activeItemCount);
        uint256 currentIndex = 0;
        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (idToMarketItem[i].active) {
                items[currentIndex] = idToMarketItem[i];
                currentIndex++;
            }
        }
        return items;
    }

    function getMarketItem(uint256 itemId) public view returns (MarketItem memory) {
        return idToMarketItem[itemId];
    }

    function fetchItemsCreated(address _creator) public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds;
        uint itemCount = 0;
        // Check against the _creator argument instead of msg.sender
        for (uint i = 1; i <= totalItemCount; i++) {
            // Change this line:
            // if (idToMarketItem[i].seller == msg.sender) {
            // To this:
            if (idToMarketItem[i].seller == _creator) { 
                itemCount++;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        uint currentIndex = 0;
        for (uint i = 1; i <= totalItemCount; i++) {
            // Change this line:
            // if (idToMarketItem[i].seller == msg.sender) {
            // To this:
            if (idToMarketItem[i].seller == _creator) {
                items[currentIndex] = idToMarketItem[i];
                currentIndex++;
            }
        }
        return items;
    }
}