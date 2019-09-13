pragma solidity ^0.5.10;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract ManaBank is ERC20, ReentrancyGuard {
    using SafeMath for uint256;

    uint8 public constant manaPerNFT = 100;

    // NOTE: Both of the following events assume manaPerNFT burned/gotten on each event
    event GetMana (
        address nftAddress,
        uint256 tokenId
    );
    event BurnMana(
        address nftAddress,
        uint256 tokenId
    );

    struct DepositedToken {
        address tokenAddress;
        uint256 tokenId;
    }

    mapping(uint256 => DepositedToken) public idxToDepositedToken;
    uint256 public lastIdx = 0;

    // NOTE: Redundant and for a 'production' app, this caching should happen in the client
    mapping(address => uint256) public tokenAddressToCount;

    // NOTE: Gets a random index *less than* than last index that has an element at it
    function _getRandomIdx() internal view returns (uint256) {
        if (lastIdx < 2) {
            // NOTE: Should never get here
            return 0;
        } else if (lastIdx == 2) {
            return 1;
        } else {
            // NOTE: blockhash might be slightly harder to grind
            uint256 zeroIndexed = block.timestamp % (lastIdx - 1);
            return zeroIndexed + 1;
        }
    }

    function _swap(uint256 idx1, uint256 idx2) internal {
        // TODO: Make sure this works
        DepositedToken memory token1 = idxToDepositedToken[idx1];
        idxToDepositedToken[idx1] = idxToDepositedToken[idx2];
        idxToDepositedToken[idx2] = token1;
    }

    function _depositToken(address _tokenAddress, uint256 _tokenId) internal {
        lastIdx += 1;
        idxToDepositedToken[lastIdx] = DepositedToken(
            _tokenAddress,
            _tokenId
        );
        tokenAddressToCount[_tokenAddress] += 1;

        // swap with random item in mapping if there are two or more elements
        if (lastIdx > 1) {
            uint256 randomIdx = _getRandomIdx();
            _swap(randomIdx, lastIdx);
        }
    }

    function _withdrawToken() internal returns (DepositedToken memory) {
        require(lastIdx > 0, "ManaBank: Can't withdraw a token when none have been deposited!");

        DepositedToken memory toReturn = idxToDepositedToken[lastIdx];
        lastIdx -= 1;
        tokenAddressToCount[toReturn.tokenAddress] -= 1;

        return toReturn;
    }

    function getMana(address[] calldata _tokenAddresses, uint256[] calldata _tokenIds) external nonReentrant {
        require(
            _tokenAddresses.length == _tokenIds.length,
            "ManaBank: Must specify an equal number of tokens and tokenIds to deposit"
        );
        require(_tokenAddresses.length > 0, "ManaBank: Must deposit a nonzero number of tokens");

        for(uint i = 0; i < _tokenAddresses.length; i++){
            address tokenAddress = _tokenAddresses[i];
            uint256 tokenId = _tokenIds[i];

            IERC721 tokenContract = IERC721(tokenAddress); // NOTE: If the gas cost of this is prohibitive,
                                                           // we could constrain the 721s to Kitties/Wizards
                                                           // explicitly; check assembly later
            require(
                tokenContract.ownerOf(tokenId) == msg.sender,
                "ManaBank: You must own all tokens being deposited for mana"
            );

            tokenContract.transferFrom(msg.sender, address(this), tokenId);
            _depositToken(tokenAddress, tokenId);

            emit GetMana(tokenAddress, tokenId);
        }

        // NOTE: Mint all mana at end to save gas
        _mint(msg.sender, (_tokenAddresses.length).mul(manaPerNFT));
    }

    function burnMana(uint256 manaToBurn) external nonReentrant {
        require(manaToBurn >= manaPerNFT, "ManaBank: Must burn enough mana for at least one token");

        uint256 numTokensToSend = manaToBurn.div(manaPerNFT);
        if (numTokensToSend > lastIdx) {
            numTokensToSend = lastIdx;
        }

        // Burn only the minimum amount of mana required to withdraw the specified tokens
        uint256 actualManaToBurn = numTokensToSend.mul(manaPerNFT);
        require(balanceOf(msg.sender) >= actualManaToBurn, "ManaBank: You must own enough mana to burn");
        _burn(msg.sender, actualManaToBurn);

        // Withdraw all tokens
        for (uint i = 0; i < numTokensToSend; i++) {
            DepositedToken memory tokenToSend = _withdrawToken();

            IERC721 tokenContract = IERC721(tokenToSend.tokenAddress);
            tokenContract.transferFrom(address(this), msg.sender, tokenToSend.tokenId);
        }
    }
}
