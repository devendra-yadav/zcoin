// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//Deployed at 0x8C253E72EF943b189eFA4CEF1A9486e97e74136f (georli test net)

/// @custom:security-contact devendra.yadav@gmail.com
contract Zcoin is ERC20, ERC20Burnable, Ownable {

    address private marketingWallet;
    address private developmentWallet;
    uint256 private marketingFeePercentage;
    uint256 private developmentFeePercentage;
    uint256 private burnPercentage;
    
    constructor() ERC20("Zcoin", "ZCN") {
        _mint(msg.sender, 100000000000 * 10 ** decimals());

        //default values. Can be changed later.
        marketingWallet=0x3e819583051b8ee4630BA218aB4080a07a8054b6;
        developmentWallet=0x9a8135535a54b13593767A03B8eDa4A430662Bc7;
        marketingFeePercentage=2;
        developmentFeePercentage=1;
        burnPercentage=1;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    //transfer after cutting all fees and token burn.
    function transfer(address _to, uint256 _amount) public override returns (bool) {

        if(_msgSender() != owner()){
            uint256 marketingFee = (marketingFeePercentage * _amount) /100 ;
            uint256 developmentFee = (developmentFeePercentage * _amount) /100;
            uint256 burnAmount = (burnPercentage * _amount) /100;

            super.transfer(marketingWallet, marketingFee);
            super.transfer(developmentWallet, developmentFee);
            _burn(_msgSender(), burnAmount);
            _amount = _amount - (marketingFee + developmentFee + burnAmount);
          
        }

        bool result = super.transfer(_to, _amount);
        require(result, "failed to transfer");

        return result;
    }

    function getDevelopmentWallet() public view returns(address){
        return developmentWallet;
    }

    function getMarketingWallet() public view returns(address) {
        return marketingWallet;
    }

    function getDevelopmentFeePercentage() public view returns(uint256){
        return developmentFeePercentage;
    }

    function getMarketingFeePercentage() public view returns(uint256){
        return marketingFeePercentage;
    }

    function getBurnPercentage() public view returns(uint256){
        return burnPercentage;
    }

    function setDevelopmentWallet(address _addr) public onlyOwner{
        require(_addr != address(0), "Development wallet cant be address(0)");
        developmentWallet = _addr;
    }

    function setMarketingWallet(address _addr) public onlyOwner{
        require(_addr != address(0), "Marketing wallet cant be address(0)");
        marketingWallet = _addr;
    }

    function setDevelopmentFeePercentage(uint256 _feePercentage) public onlyOwner{
        require(_feePercentage>=0 && _feePercentage<=10, "Invalid fee percentage");
        developmentFeePercentage = _feePercentage;
    }

    function getMarketingFeePercentage(uint256 _feePercentage) public onlyOwner{
        require(_feePercentage>=0 && _feePercentage<=10, "Invalid fee percentage");
        marketingFeePercentage = _feePercentage;
    }

    function setBurnPercentage(uint256 _feePercentage) public onlyOwner{
        require(_feePercentage>=0 && _feePercentage<=10, "Invalid fee percentage");
        burnPercentage = _feePercentage;
    }
    
}