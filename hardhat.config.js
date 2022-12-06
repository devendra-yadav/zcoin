/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");
require("dotenv/config");
module.exports = {
  solidity: "0.8.9",
  networks: {
    georli: {
      url: process.env.NODE_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
