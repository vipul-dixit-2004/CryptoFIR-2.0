const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const FIR_Records = require("../build/contracts/FIR_Records.json");

const provider = new HDWalletProvider(
  "limb visa add insect pave buyer drill torch wolf balcony food duty",
  "https://localtestnet-ganache.onrender.com"
);

const web3 = new Web3("http://127.0.0.1:8545" || provider);

const abi = FIR_Records.abi;
const address =
  "0x0220064b95733a670f00ce4e71ef6dd54dc0452e" ||
  FIR_Records.networks[1722058029989].address;

const contract = new web3.eth.Contract(abi, address);
console.log("contract created");

async function fetchCount() {
  try {
    const count = await contract.methods.recordCount().call();
    return parseInt(count);
  } catch (error) {
    console.log("Error fetching record count: " + error.message);
    throw error;
  }
}

module.exports = {
  fetchCount,
  contract,
};
