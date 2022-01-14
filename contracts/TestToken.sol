// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetFixedSupply.sol";

contract TestToken  is ERC20PresetFixedSupply {
   constructor() ERC20PresetFixedSupply("Test", "Test", 999888888888 ether, msg.sender) {}
}