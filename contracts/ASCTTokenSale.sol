pragma solidity ^0.6.0;


import "./Crowdsale.sol";
import "./KycContract.sol";

contract ASCTTokenSale is Crowdsale {

    KycContract kyc;
    constructor(
        uint256 rate,    // rate in TKNbits
        address payable wallet,
        IERC20 token,
        KycContract _kyc
    )
        Crowdsale(rate, wallet, token)
        public
    {
        kyc = _kyc;
    }
    //Check if the user is whitelisted when pre-validating purchase.
    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(kyc.kycCompleted(beneficiary), "KYC not completed yet, aborting!"); 
    }

}