// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract TDai is ERC20, ERC20Permit {
    constructor() ERC20("TDai", "TDAI") ERC20Permit("TDai") {
        _mint(msg.sender, 1000000000000000000000000);
    }

    function mint(uint256 _amount) external {
        _mint(msg.sender, _amount);
    }
}
