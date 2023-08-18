// // require("@nomicfoundation/hardhat-toolbox");
// require("@nomicfoundation/hardhat-ethers");
// // require("@nomiclabs/hardhat-waffle")
// // require("@nomiclabs/hardhat-etherscan")
// require("dotenv").config()  
// require("@nomicfoundation/hardhat-verify");
// // require("./tasks/block-number")
// require('hardhat-deploy');

require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
// require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()


// require("@nomicfoundation/hardhat-toolbox");
// require('hardhat-deploy');
// require("dotenv").config()


const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  defaultNetwork: "hardhat",
  networks:{
    polygon_mumbai : {
        url: POLYGON_RPC_URL,
        accounts : [PRIVATE_KEY],
        chainId : 80001,
        blockConfirmations: 6
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337
    }
  },
    solidity: "0.8.8",
    etherscan: {
       apiKey: ETHERSCAN_API_KEY
    },
    
    namedAccounts: {
      deployer: {
          default: 0, // here this will by default take the first account as deployer
      },
  },
    
  };
  