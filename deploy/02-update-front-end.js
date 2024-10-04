const fs = require("fs")
const { network, ethers } = require("hardhat")

const FRONT_END_ADDRESSES_FILE = "../nextjs-smartcontract-lottery-fcc/constants/contractAddresses.json"
const FRONT_END_ABI_FILE = "../nextjs-smartcontract-lottery-fcc/constants/abi.json"

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end updated!")
    }
}

async function updateAbi() {
    try {
        const raffle = await ethers.getContract("Raffle")
        console.log("Raffle contract found:", raffle.address)
        fs.writeFileSync(FRONT_END_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json))
        console.log("ABI updated!")
    } catch (error) {
        console.error("Error updating ABI:", error)
    }
}

async function updateContractAddresses() {
    try {
        const raffle = await ethers.getContract("Raffle")
        const chainId = network.config.chainId.toString()
        console.log("Network chainId:", chainId)
        const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf-8"))

        if (chainId in currentAddresses) {
            if (!currentAddresses[chainId].includes(raffle.address)) {
                currentAddresses[chainId].push(raffle.address)
            }
        } else {
            currentAddresses[chainId] = [raffle.address]
        }

        fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses, null, 2))
        console.log("Contract addresses updated!")
    } catch (error) {
        console.error("Error updating contract addresses:", error)
    }
}

module.exports.tags = ["all", "frontend"]
