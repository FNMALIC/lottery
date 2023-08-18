const { network,ethers } = require("hardhat")
const {developmentChain, networkConfig } = require("../helper-hardhat-config")
// const { ethers } = require("ethe")

const { verify } = require("../utils/verify")
// const { networks } = require("../hardhat.config")


const VRF_SUB_FUND_AMOUNT = ethers.parseEther("3")


module.exports = async function ({getNamedAccounts, deployments }){
    const {deploy, log } = deployments
    const {deployer} = await getNamedAccounts()
    const chainId =  network['config']['chainId']
    let vrfCoordinatorV2Address , subscriptionId

    console.log(network['config']['chainId'],chainId)
    if(developmentChain.includes(network.name)){
        // const coordinatorV2 = await deployments.get("VRFCoordinatorV2Mock")
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        // const name = await vrfCoordinatorV2MockFactory.deploy()
        // console.log(vrfCoordinatorV2Mock)
        // console.log(vrfCoordinatorV2MockFactory["interface"]["events"]['SubscriptionCreated'])
        // console.log(vrfCoordinatorV2MockFactory.interface.events)
        vrfCoordinatorV2Address = await vrfCoordinatorV2Mock.getAddress();
        // log(vrfCoordinatorV2Address)
        // const deploymentTransaction = await vrfCoordinatorV2Mock.deploymentTransaction()
        // its a question of ethers version
        // vrfCoordinatorV2Address = vrfCoordinatorV2Mock.getAddress()
        // console.log(deploymentTransaction)
        // console.log(await vrfCoordinatorV2Mock.getAddress())
        
        const  txnResponse = await vrfCoordinatorV2Mock.createSubscription()
        const txnReceipt = await txnResponse.wait(1)
        log(txnReceipt.logs[0].args.subId)
        subscriptionId = await txnReceipt.logs[0].args.subId

        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId,VRF_SUB_FUND_AMOUNT )
    }else{
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }


    const gaslimit = networkConfig[chainId]['gaslimit']
    const entranceFee = networkConfig[chainId]['entranceFee']
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    const interval = networkConfig[chainId]["interval"]
    log("++++++++++++++++")
    console.log(deployer);
    const args  = [ entranceFee,vrfCoordinatorV2Address,  gaslimit,subscriptionId,callbackGasLimit,interval]
    console.log(args);

    const lottery = await deploy("lottery",{
        from: deployer,
        args:args,
        log: true,
         waitConfirmations: 6
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("verifying.......")
        await verify(lottery.address,args)
    }

    log("------------------------------------")
    
}

module.exports.tags = ["all", "lottery"]
