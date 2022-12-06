const { ethers } = require("hardhat");

async function main(){
    const [deployer] = await ethers.getSigners();
    let zCoinFactory = await ethers.getContractFactory('Zcoin');
    let zCoinContract = await zCoinFactory.deploy();
    console.log(`zCoin deployed at ${zCoinContract.address}`);
}

main().then(()=>{
    process.exit(1);
}).catch((error)=>{
    process.exit(-1);
    console.log(`Error deploying zCoin. ${error}`);
});