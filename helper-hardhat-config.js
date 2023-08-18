const { ethers } = require("ethers")
const networkConfig = {
    80001: {
      name: "polygon_mumbai",
      ethUsdPriceFeed: "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
      vrfCoordinatorV2: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
      entranceFee: ethers.parseEther("0.01"),
      gaslimit: "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f",
      subscriptionId: "0",
      callbackGasLimit: "500000",
      interval: 30,
    },
    31337: {
      name: "hardhat",
      entranceFee: ethers.parseEther("0.01"),
      gaslimit: "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f",
      callbackGasLimit: "500000",
      interval: 30,
    },
  };
  
  // Rest of the code...
  
const developmentChain = ["hardhat", "localhost"]

const DECIMALS = 8
const INITIAL_ANSWER = 20000000000 

module.exports = {
    networkConfig ,
    developmentChain,
    DECIMALS,
    INITIAL_ANSWER
}