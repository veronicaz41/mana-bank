pragma solidity ^0.5.0;

contract Example {
    uint256 public a = 2;

    constructor() public {}

    function setA(uint256 _a) public {
        a = _a;
    }
}
