pragma solidity ^0.5.10;

import "../ManaBank.sol";
import "./ApprovableERC721.sol";

contract TestManaBank is ManaBank {
    // Mints a token of the specified NFT to this contract and awards the specified account with mana for it
    function mint(address _account, address _nftAddress, uint256 _tokenId) external {
        ApprovableERC721 tokenContract = ApprovableERC721(_nftAddress);
        tokenContract.mint(address(this), _tokenId);

        _depositToken(_nftAddress, _tokenId);

        _mint(_account, manaPerNFT);
    }
}
