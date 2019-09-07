pragma solidity ^0.5.10;

import "../ManaBank.sol";

contract TestManaBank is ManaBank {
    function setTokenCount(address _tokenAddress, uint256 _count) public {
        tokenAddressToCount[_tokenAddress] = _count;
    }

    function mint(address _account, uint256 _amount) public {
        _mint(_account, _amount);
    }
}
