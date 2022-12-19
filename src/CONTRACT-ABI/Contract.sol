// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    uint[] public nftTokenList;
    Counters.Counter private _tokenIds;
   
    struct Royalty {
        address recipient;
        uint256 value;
    }

    struct Price {
        uint256 amount;
    }

    struct Collection {
        string collection;
        uint token;
    }

    struct PrivetContent {
        string privetUri;
        uint token;
    }

    struct TokenListingState {
        string tokenState;
        uint token;
    }

    mapping(uint256 => Royalty) internal _royalties;
    mapping(uint256 => PrivetContent) internal _privetContains;
    mapping(uint256 => Price) internal _prices;
    mapping(uint256 => TokenListingState) internal _tokenListingState;

    Collection[] public collections;

    constructor() ERC721("Real Estate Nft", "BUILDING") {}

    function mintNFT(
        string memory tokenURI, 
        uint amount, 
        uint royelrtPercentage, 
        string memory category, 
        string memory privetUri,
        address createrAccount,
        string memory tokenListingState
        )
        public
        returns (uint256)
    {
        require(royelrtPercentage <= 20,'Max 20% royalty allowed');
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(createrAccount, newItemId);
        _setTokenURI(newItemId, tokenURI);
        nftTokenList.push(newItemId);
        _setNftPrice(newItemId,amount);
        _setTokenRoyalty(newItemId,createrAccount, royelrtPercentage);
        _setNftCollection(newItemId,category);
        _setTokenPrivetContent(newItemId,privetUri);
        setTokenListingState(newItemId,tokenListingState);
        return newItemId;
    }
    
    function buyNft( address from, address to, uint tokenId) public payable {
        Royalty memory royalty = _royalties[tokenId];
        uint nftPrice = getNftPrice(tokenId);
        require(msg.value >= nftPrice);
        require(nftPrice > royalty.value);
        address payable authorAddress =  payable(royalty.recipient);
        uint royeltyAmount = (nftPrice * royalty.value) / 100;
        uint remeainingAmount = (nftPrice - royeltyAmount);
        address payable fromAddress = payable(from);
        if(royalty.recipient != from){
            authorAddress.transfer(royeltyAmount);
            fromAddress.transfer(remeainingAmount);
        }else{
           fromAddress.transfer(nftPrice);
        }
        _transfer(from, to, tokenId);
    }

    function doTransfer( address from, address to, uint tokenId) public  {
        _transfer(from, to, tokenId);
    }

    function getToken() public view returns (uint[] memory) {
        return  nftTokenList;
    }

    function _setNftPrice(
        uint256 token,
        uint amount
    ) public {
        _prices[token] = Price(amount);
    }

    function getNftPrice(uint tokenId)
        public
        view
        returns (uint amount)
    {
        Price memory priceData = _prices[tokenId];
        return (priceData.amount);
    }

    function _setTokenRoyalty(
        uint256 id,
        address recipient,
        uint256 value
    ) internal {
        require(value <= 99, 'ERC2981Royalties: Too high');
        _royalties[id] = Royalty(recipient, value);
    }

    function royaltyInfo(uint256 tokenId, uint256 sellPrice)
        public
        view
        returns (address receiver, uint256 royaltyAmount)
    {
        Royalty memory royalty = _royalties[tokenId];
        return (royalty.recipient, (sellPrice * royalty.value) / 100);
    }
   
    function getRoyeltyValue( uint tokenId) public view returns(uint amount){
        Royalty memory royalty = _royalties[tokenId];
        return royalty.value;
    }

     function _setNftCollection(uint token, string memory collectionName) internal {
       Collection memory newCollection = Collection({
            collection:collectionName,
            token:token
        });
       collections.push(newCollection);
    }

    function getCollection() public view returns ( Collection[] memory) {
        return collections;
    }

    function setTokenListingState(
        uint256 id,
        string memory tokenState
    ) public {
        _tokenListingState[id] = TokenListingState(tokenState, id);
    }
    
    function getTokenListingState( uint tokenId) public view returns (string memory tokenState, uint256 token){
        TokenListingState memory tokenListingState = _tokenListingState[tokenId];
        return (tokenListingState.tokenState, tokenListingState.token );
    }

    function _setTokenPrivetContent(
        uint256 id,
        string memory privetUri
    ) private {
        _privetContains[id] = PrivetContent(privetUri, id);
    }

    function getPrivetContent( uint tokenId) public view returns (string memory privetUri, uint256 token){
        address tokenOwner = ownerOf(tokenId);
        require(msg.sender == tokenOwner, "Privet content is only accessable to token owner");
        PrivetContent memory privetContent = _privetContains[tokenId];
        return (privetContent.privetUri, privetContent.token );
    }
  
}