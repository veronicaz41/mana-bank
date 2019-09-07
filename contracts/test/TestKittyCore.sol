pragma solidity ^0.5.10;

import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";

contract TestKittyCore is ERC721Mintable {
    function mint(address _account, uint256 _amount) public {
        _mint(_account, _amount);
    }
}
