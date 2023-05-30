// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const USDT_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const UNISWAP_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

async function main() {
  
  let owner;
  let user;
  let uniswapRouter;
  let usdc;
  let usdt;
  let weth;
  let tokenSwap;

  [owner, user] = await ethers.getSigners();

    // Use existing Uniswap router contracts on the mainnet
    uniswapRouter = await ethers.getContractAt(
      'IUniswapV2Router02',
      UNISWAP_ROUTER_ADDRESS
    );

    // Use existing USDC and USDT contracts on the mainnet
    weth = await ethers.getContractAt('IWETH', WETH_ADDRESS);
    usdc = await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', USDC_ADDRESS); // USDC address on mainnet
    usdt = await ethers.getContractAt('@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20', USDT_ADDRESS); // USDT address on mainnet

    // Calculate the amount of ETH to convert to USDC
    const ethToConvert = ethers.utils.parseEther("40");

    // Call the swapExactETHForTokensUniswap function to get USDC on the Uniswap router contract
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
    let path = [weth.address, usdc.address];
    await uniswapRouter.connect(user).swapExactETHForTokens(0, path, owner.address, deadline, { value: ethToConvert });

    // Transfer USDC to the user account
    await usdc.transfer(user.address, 1000);

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
