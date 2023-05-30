// Import the required modules
const { WETH } = require("@uniswap/sdk");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const USDT_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const UNISWAP_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";


describe("TokenSwap", function () {
  // Define variables to store contract instances
  let owner;
  let user;
  let uniswapRouter;
  let usdc;
  let usdt;
  let weth;
  let tokenSwap;

  // Deploy the contracts before each test case
  beforeEach(async function () {

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

    console.log(await usdc.balanceOf(owner.address));
    // Transfer USDC to the user account
    await usdc.transfer(user.address, 1000);

    // Deploy the TokenSwap contract, passing in the deployed tokens and Uniswap router as arguments
    const TokenSwap = await ethers.getContractFactory("TokenSwap");
    tokenSwap = await TokenSwap.connect(owner).deploy(usdc.address, usdt.address, uniswapRouter.address);
    await tokenSwap.deployed();
  });

  it('should revert if invalid token address is used', async () => {

    const invalidAddress = '0x0000000000000000000000000000000000000000'; // An invalid Ethereum address

    const TokenSwap = await ethers.getContractFactory("TokenSwap");

    await expect(TokenSwap.connect(owner).deploy(invalidAddress, usdt.address, uniswapRouter.address))
      .to.be.revertedWith('TokenSwap: Invalid USDC address');
    await expect(TokenSwap.connect(owner).deploy(usdc.address, invalidAddress, uniswapRouter.address))
      .to.be.revertedWith('TokenSwap: Invalid USDT address');
  });

  describe("Swap USDC to USDT", () => {
    
    it("should revert with the right error if there is no enough USDC token balance in user account", async function () {

      const swapAmount = 2100;
      await usdc.connect(user).approve(tokenSwap.address, swapAmount);
      const userTokenSwap = await tokenSwap.connect(user);
      await expect(userTokenSwap.swapUSDCtoUSDT(swapAmount)).to.revertedWith("TokenSwap: Not enough tokens");

    });
  
    it("should swap USDC to USDT", async function () {
      
      const swapAmount = 100;
      const initialUSDTBalance = await usdt.balanceOf(user.address);
      await usdc.connect(user).approve(tokenSwap.address, swapAmount);

      const userTokenSwap = await tokenSwap.connect(user);

      // Swap USDC to USDT
      await userTokenSwap.swapUSDCtoUSDT(swapAmount);
  
      // Get the final USDT balance of the user's account
      const finalUSDTBalance = await usdt.balanceOf(user.address);

      // Check that the final USDT balance is greater than the initial balance
      await expect(finalUSDTBalance).to.be.gt(initialUSDTBalance);
    });
  });
});