// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IHERC20.sol";

/**
 * SavingsGoal contract
 *
 * @notice SavingsGoal is a contract that allows users to set a goal amount of DAI and ohther supported tokens to save up for
 * @dev Users can add funds to the contract and once the goal amount is reached, the owner can withdraw the funds
 * The contract is also compatible with the Chainlink Keeper network to allow for automated funding/saving
 * @author elcharitas <jonathanirhodia@gmail.com> - https://links.dev/elcharitas
 *
 * Example: Alice wants to save up 1000 DAI in 10 days. She creates a SavingsGoal contract with the following parameters:
 * - token: DAI
 * - goalAmount: 1000 DAI
 * - daysToReachGoal: 10
 * - goalName: "New Laptop"
 * - goalDescription: "I want to buy a new laptop"
 * Alice then adds funds to the contract/allow the contract automate and once the goal amount is reached, she can withdraw the funds
 */
contract SavingsGoal is Ownable {
    address public immutable token;
    uint256 public immutable startTimestamp;
    uint256 public goalAmount;
    uint256 public daysToReachGoal;
    string public goalName;
    string public goalDescription;

    constructor(
        address _token,
        uint256 _goalAmount,
        uint256 _daysToReachGoal,
        string memory _goalName,
        string memory _goalDescription
    ) {
        require(_goalAmount > 0, "Goal amount must be greater than zero");
        require(
            _daysToReachGoal > 0,
            "Days to reach goal must be greater than zero"
        );
        token = _token;
        goalAmount = _goalAmount;
        daysToReachGoal = _daysToReachGoal * 1 days;
        goalName = _goalName;
        goalDescription = _goalDescription;

        IHERC20 dai = IHERC20(token);

        // Approve the contract to spend the total amount from the user's wallet
        dai.permit(
            msg.sender,
            address(this),
            goalAmount,
            block.timestamp + daysToReachGoal,
            0,
            bytes32(0),
            bytes32(0)
        );

        startTimestamp = block.timestamp;
    }

    function addFunds() external {
        require(startTimestamp > 0, "Goal has not started yet");

        uint256 elapsedTime = block.timestamp - startTimestamp;
        require(elapsedTime <= daysToReachGoal, "Goal period has ended");

        IHERC20 dai = IHERC20(token);

        uint256 goalBalance = dai.balanceOf(address(this));
        require(goalBalance < goalAmount, "Goal has been reached");

        uint256 amountToAdd = (goalAmount / daysToReachGoal / 1 days) * 1e18;
        require(
            goalBalance + amountToAdd <= goalAmount,
            "Goal amount has already been reached"
        );

        dai.transferFrom(owner(), address(this), amountToAdd);
    }

    function getRemainingAmount() external view returns (uint256) {
        return goalAmount - balanceOf();
    }

    function isGoalReached() external view returns (bool) {
        return balanceOf() >= goalAmount;
    }

    /**
     * @notice Returns the balance of the contract
     */
    function balanceOf() public view returns (uint256) {
        IHERC20 dai = IHERC20(token);
        return dai.balanceOf(address(this));
    }

    /**
     * @notice Withdraws the funds from the contract once the goal amount has been reached
     * @dev Only the owner of the contract can call this function
     */
    function withdraw() external onlyOwner {
        IHERC20 dai = IHERC20(token);
        uint256 goalBalance = dai.balanceOf(address(this));

        require(goalAmount >= goalBalance, "Goal not reached");

        dai.transfer(owner(), goalBalance);
    }
}
