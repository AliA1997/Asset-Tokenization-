pragma solidity >=0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ASCTToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("StarDucks Ali-Capu-Token", "ASCT") public {
        _mint(msg.sender, initialSupply);
    _setupDecimals(0);
    }
}