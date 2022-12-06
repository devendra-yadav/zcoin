const { expect } = require("chai");
const { ethers } = require("hardhat")

//convert wei to ethers
function weiToEthers(weiAmount){
    return ethers.utils.formatEther(weiAmount);
}

//ethers to wei
function ethersToWei(ethAmount){
    return ethers.utils.parseEther(ethAmount.toString());
}



describe('ZCoin',function(){

    let deployer;
    let totalSupply;
    let zCoinContract;
    let deployerBalance;
    let addr1;
    let addr1Signer;
    let addr2;
    let addr2Signer;
    let addr3;
    let marketingWallet;
    let developmentWallet;

    beforeEach(async function(){
        const signers = await ethers.getSigners();

        deployer = signers[0].address;
        addr1 = signers[1].address;
        addr1Signer=signers[1];
        addr2 = signers[2].address;
        addr2Signer = signers[2];
        addr3 = signers[3].address;
        marketingWallet = signers[4].address;
        developmentWallet = signers[5].address;

        const tokenFactory = await ethers.getContractFactory("Zcoin");
        zCoinContract = await tokenFactory.deploy();
                
        console.log(`ZCoin deployed at ${zCoinContract.address}. addr1 : ${addr1} addr2 : ${addr2}`);
        console.log(`Marketing Wallet : ${marketingWallet}. Development Wallet : ${developmentWallet}`);
    });

    it('Contract deployment set initial supply and owner balance correctly', async function(){
        
       totalSupply = await zCoinContract.totalSupply();
       deployerBalance = await zCoinContract.balanceOf(deployer);
       console.log(`Total supply : ${weiToEthers(totalSupply)}. Owner balance : ${weiToEthers(deployerBalance)}`);

       expect(totalSupply).equal(ethersToWei(100000000000));
       expect(deployerBalance).equal(ethersToWei(100000000000));

    });

    it('Token transferred from deployer to another wallet without any fee deductions or burn', async function(){
        //Transfer 10000 coints to addr1 from deployer;
        await zCoinContract.transfer(addr1, ethersToWei(1000000000));
        let deployerBalance = weiToEthers(await zCoinContract.balanceOf(deployer));
        let addr1Balance = weiToEthers(await zCoinContract.balanceOf(addr1));

        console.log(`deployer balance : ${deployerBalance} and addr1Balance : ${addr1Balance}`);
        expect(deployerBalance).equal('99000000000.0');
        expect(addr1Balance).equal('1000000000.0');
    });

    it('Marketing wallet change done successfully', async function(){
        
        let currentMarketingWallet = await zCoinContract.getMarketingWallet();
        await zCoinContract.setMarketingWallet(marketingWallet);
        let newMarketingWallet = await zCoinContract.getMarketingWallet();
        console.log(`Old marketing wallet : ${currentMarketingWallet}. New Marketing Wallet : ${newMarketingWallet}`);
        expect(currentMarketingWallet).equals('0x3e819583051b8ee4630BA218aB4080a07a8054b6');
        expect(newMarketingWallet).equals(marketingWallet);
        
    });

    it('Development wallet change done successfully', async function(){
        
        let currentDevelopmentWallet = await zCoinContract.getDevelopmentWallet();
        await zCoinContract.setDevelopmentWallet(developmentWallet);
        let newDevelopmentWallet = await zCoinContract.getDevelopmentWallet();
        console.log(`Old marketing wallet : ${currentDevelopmentWallet}. New Marketing Wallet : ${newDevelopmentWallet}`);
        expect(currentDevelopmentWallet).equals('0x9a8135535a54b13593767A03B8eDa4A430662Bc7');
        expect(newDevelopmentWallet).equals(developmentWallet);
        
    });

    it('Burn percentage change done successfully', async function(){
        
        let currentBurnPercentage = await zCoinContract.getBurnPercentage();
        await zCoinContract.setBurnPercentage(5);
        let newBurnPercentage = await zCoinContract.getBurnPercentage();
        console.log(`Old Burn Percentage : ${currentBurnPercentage}. New Burn Percentage : ${newBurnPercentage}`);
        expect(currentBurnPercentage).equals(1);
        expect(newBurnPercentage).equals(5);
        
    });

    it('Token transfer from non deployer wallet deduct fees and burn token correctly', async function(){

        //transfer some amount to addr1 from deployer wallet
        await zCoinContract.transfer(addr1, ethersToWei(50000000));
        zCoinContract.setMarketingWallet(marketingWallet);
        zCoinContract.setDevelopmentWallet(developmentWallet);

        let addr1Balance = await zCoinContract.balanceOf(addr1);
        let addr2Balance = await zCoinContract.balanceOf(addr2);
        let addr3Balance = await zCoinContract.balanceOf(addr3);
        let totalSupply = await zCoinContract.totalSupply();
        let marketingWalletBalance = await zCoinContract.balanceOf(marketingWallet);
        let developmentWalletBalance = await zCoinContract.balanceOf(developmentWallet);

        console.log(`addr1Balance : ${weiToEthers(addr1Balance)}. addr2Balance : ${weiToEthers(addr2Balance)}. addr3Balance : ${weiToEthers(addr3Balance)}.  totalSupply : ${weiToEthers(totalSupply)}. marketingWalletBalance : ${weiToEthers(marketingWalletBalance)}. developmentWalletBalance : ${weiToEthers(developmentWalletBalance)}`);

        //transfer from addr1 to addr2
        await zCoinContract.connect(addr1Signer).transfer(addr2, ethersToWei(1000000));
        await zCoinContract.connect(addr1Signer).transfer(addr2, ethersToWei(1000000));
        await zCoinContract.connect(addr1Signer).transfer(addr2, ethersToWei(1000000));
        await zCoinContract.connect(addr2Signer).transfer(addr3, ethersToWei(1000000));
        await zCoinContract.connect(addr2Signer).transfer(addr3, ethersToWei(1000000));

        addr1Balance = await zCoinContract.balanceOf(addr1);
        addr2Balance = await zCoinContract.balanceOf(addr2);
        addr3Balance = await zCoinContract.balanceOf(addr3);
        
        totalSupply = await zCoinContract.totalSupply();
        marketingWalletBalance = await zCoinContract.balanceOf(marketingWallet);
        developmentWalletBalance = await zCoinContract.balanceOf(developmentWallet);

        console.log(`addr1Balance : ${weiToEthers(addr1Balance)}. addr2Balance : ${weiToEthers(addr2Balance)}. addr3Balance : ${weiToEthers(addr3Balance)}. totalSupply : ${weiToEthers(totalSupply)}. marketingWalletBalance : ${weiToEthers(marketingWalletBalance)}. developmentWalletBalance : ${weiToEthers(developmentWalletBalance)}`);
        expect(weiToEthers(addr1Balance)).eq('47000000.0');
        expect(weiToEthers(addr2Balance)).eq('880000.0');
        expect(weiToEthers(addr3Balance)).eq('1920000.0');
        expect(weiToEthers(totalSupply)).eq('99999950000.0');
        expect(weiToEthers(marketingWalletBalance)).eq('100000.0');
        expect(weiToEthers(developmentWalletBalance)).eq('50000.0');

    });
})