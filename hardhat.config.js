// require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()  
// require("@nomicfoundation/hardhat-verify");
// require("./tasks/block-number")


const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY


module.exports = {
    networks:{
      polygon_mumbai : {
          url: POLYGON_RPC_URL,
          accounts : [PRIVATE_KEY],
          chainId : 80001
  
      },
      localhost: {
        url: "http://127.0.0.1:8545/",
        chainId: 31337
      }
    }, 
  
    solidity: "0.8.8",
    etherscan: {
       apiKey: ETHERSCAN_API_KEY
    }
    
  };
  