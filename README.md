


## TokenSwap

TokenSwap is a smart contract that allows users to swap USDC tokens for USDT tokens using the Uniswap decentralized exchange. This contract is built on the Ethereum blockchain using Solidity version 0.8.0 and utilizes the OpenZeppelin and Uniswap v2-periphery libraries.

#### Requirements
+ Node.js
+ Truffle
+ Hardhat

#### Installation


1. Install dependencies.
```shell
git clone https://github.com/peterch0829/TokenSwap.git
```

2. Install dependencies.
```shell
npm install
```

3. Compile the contract.
```shell
npx hardhat compile
```

4. Deploy the contract to a test network or the mainnet.
```shell
npx hardhat run scripts/deploy.js
```

5. Interact with the contract by calling the swapUSDCtoUSDT(uint256 amount) function to swap USDC tokens for USDT tokens.

#### Usage

To swap USDC tokens for USDT tokens, call the swapUSDCtoUSDT function and pass in the amount of USDC tokens you want to swap as a parameter.

```shell
function swapUSDCtoUSDT(uint256 amount) external
```

The function first checks if the user has enough USDC tokens to make the swap. If they do, it transfers the USDC tokens to the TokenSwap contract, approves the Uniswap router to spend the user's USDC tokens, creates a path array with the addresses of USDC and USDT, and calls the swapExactTokensForTokens function to complete the swap.

The function returns an array of uint256 values representing the amount of USDC and USDT tokens exchanged during the swap.

#### License

This project is licensed under the [MIT License](https://opensource.org/license/mit/ "MIT License link")