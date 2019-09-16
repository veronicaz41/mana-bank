pragma solidity ^0.5.10;

import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";

contract TestKittyCore is ERC721Mintable {
  mapping (uint256 => address) public kittyIndexToApproved;

  function approve(address _to, uint256 _tokenId) public {
      kittyIndexToApproved[_tokenId] = _to;
      super.approve(_to, _tokenId);
  }
}
