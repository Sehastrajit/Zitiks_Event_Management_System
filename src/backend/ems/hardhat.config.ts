import { defineConfig } from "hardhat/config";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import hardhatNodeTestRunner from "@nomicfoundation/hardhat-node-test-runner";

export default defineConfig({
  solidity: "0.8.28",
  plugins: [hardhatEthers, hardhatNodeTestRunner],
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
});
