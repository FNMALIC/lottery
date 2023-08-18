
const { run } = require("hardhat")


async function verify(contractAddress, args) {
    console.log(`Verifying contract ${contractAddress}`);
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("------------------------");
            console.log("PCW::Already verified.");
        } else {
            console.log("e.message");
            console.log(e.message.toLowerCase());
        }
    }
}


module.exports = { verify }
