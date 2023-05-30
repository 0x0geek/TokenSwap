// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IWETH.sol";
import "hardhat/console.sol";

contract TokenSwap {
    IERC20 private _usdc;
    IERC20 private _usdt;
    IUniswapV2Router02 private _uniswapRouter;

    event Swap(address indexed user, uint256 amountIn, uint256 amountOut);

    constructor(IERC20 usdc, IERC20 usdt, IUniswapV2Router02 uniswapRouter) {

        require(address(usdc) != address(0), "TokenSwap: Invalid USDC address");
        require(address(usdt) != address(0), "TokenSwap: Invalid USDT address");

        _usdc = usdc;
        _usdt = usdt;
        _uniswapRouter = uniswapRouter;
    }

    function swapUSDCtoUSDT(uint256 amount) external {
       
        // Retrieve user's USDC balance
        uint256 usdcBalance = _usdc.balanceOf(msg.sender);

        // Check if user has enough USDC to make swap
        require(usdcBalance >= amount, "TokenSwap: Not enough tokens");

        // Transfer USDC token to TokenSwap contract
        _usdc.transferFrom(msg.sender, address(this), amount);

        // Approve Uniswap router to spend user's USDC
        _usdc.approve(address(_uniswapRouter), amount);

        // Create path array with addresses of USDC and USDT
        address[] memory path = new address[](2);
        path[0] = address(_usdc);
        path[1] = address(_usdt);

        //Call swapExactTokensForTokens function
        uint256[] memory amounts =
            _uniswapRouter.swapExactTokensForTokens(
                amount,
                0,
                path,
                msg.sender,
                block.timestamp + 360 * 3600 * 24
            );

        // Emit event with swap details
        emit Swap(msg.sender, amount, amounts[1]);
    }
}