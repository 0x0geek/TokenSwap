// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const USDT_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const UNISWAP_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

async function main() {
  
    let uniswapRouter;
    let usdc;
    let usdt;
    let tokenSwap;

    const [owner] = await ethers.getSigners();

    // Use existing Uniswap router contracts on the mainnet
    uniswapRouter = await ethers.getContractAt(
      'IUniswapV2Router02',
      UNISWAP_ROUTER_ADDRESS
    );

    // Use existing USDC and USDT contracts on the mainnet
    usdc = await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', USDC_ADDRESS); // USDC address on mainnet
    usdt = await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', USDT_ADDRESS); // USDT address on mainnet

    // Deploy the TokenSwap contract, passing in the deployed tokens and Uniswap router as arguments
    const TokenSwap = await ethers.getContractFactory("TokenSwap");
    tokenSwap = await TokenSwap.connect(owner).deploy(usdc.address, usdt.address, uniswapRouter.address);
    await tokenSwap.deployed();

    console.log(
      `TokenSwap deployed to ${tokenSwap.address}`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
