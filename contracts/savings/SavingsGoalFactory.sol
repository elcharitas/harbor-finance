// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "./SavingsGoal.sol";

/**
 * SavingsGoalFactory contract
 *
 * @notice SavingsGoalFactory is a contract that allows users to create savings goals
 * It implements the Chainlink Keeper network to allow for automated funding/saving
 * @author elcharitas <jonathanirhodia@gmail.com> - https://links.dev/elcharitas
 */
contract SavingsGoalFactory is KeeperCompatibleInterface, Ownable {
    address[] public allSavingsGoals;

    address[] public allowedTokens;

    event SavingsGoalCreated(
        address indexed savingsGoal,
        address indexed creator
    );

    event SavingGoalFunded(
        address indexed savingsGoal,
        address indexed funder,
        uint256 amount
    );

    /**
     * @notice Checks if a token is allowed for savings goals
     * @param token The address of the token to check
     */
    function isTokenAllowed(address token) public view returns (bool) {
        for (uint256 i = 0; i < allowedTokens.length; i++) {
            if (allowedTokens[i] == token) {
                return true;
            }
        }
        return false;
    }

    /**
     * @notice Checks if the contract requires work to be done
     */
    function checkUpkeep(
        bytes memory /* checkData */
    ) public view override returns (bool, bytes memory) {
        if (allSavingsGoals.length == 0) {
            return (false, "");
        }
        for (uint256 i = 0; i < allSavingsGoals.length; i++) {
            SavingsGoal savingsGoal = SavingsGoal(allSavingsGoals[i]);
            if (
                (block.timestamp - savingsGoal.startTimestamp()) % 1 days == 0
            ) {
                return (true, abi.encode(savingsGoal));
            }
        }
        return (false, "");
    }

    /**
     * @notice Performs the work on the contract, if instructed by :checkUpkeep():
     * @param performData The data returned by the checkData
     */
    function performUpkeep(bytes calldata performData) external override {
        SavingsGoal savingsGoal = SavingsGoal(
            abi.decode(performData, (address))
        );

        if (!savingsGoal.isGoalReached()) {
            savingsGoal.addFunds();
        }
    }

    /**
     * @notice Creates a new savings goal
     * @param daiToken The address of the DAI token
     * @param goalAmount The amount of DAI to save up
     * @param daysToReachGoal The number of days to reach the goal
     * @param goalName The name of the goal
     * @param goalDescription The description of the goal
     */
    function createSavingsGoal(
        address daiToken,
        uint256 goalAmount,
        uint256 daysToReachGoal,
        string memory goalName,
        string memory goalDescription
    ) external {
        require(
            isTokenAllowed(daiToken),
            "Token is not allowed for savings goals"
        );

        SavingsGoal newSavingsGoal = new SavingsGoal(
            daiToken,
            goalAmount,
            daysToReachGoal,
            goalName,
            goalDescription
        );

        newSavingsGoal.transferOwnership(msg.sender);

        address newSavingAddress = address(newSavingsGoal);

        allSavingsGoals.push(newSavingAddress);

        emit SavingsGoalCreated(newSavingAddress, msg.sender);
    }

    /**
     * @notice Gets all the savings goals created
     */
    function getAllSavingsGoals() external view returns (address[] memory) {
        return allSavingsGoals;
    }

    /**
     * @notice Gets all the savings goals created by a user
     */
    function getUserSavingsGoals() external view returns (address[] memory) {
        address[] memory userSavingsGoals = new address[](
            allSavingsGoals.length
        );
        uint256 counter = 0;
        for (uint256 i = 0; i < allSavingsGoals.length; i++) {
            SavingsGoal savingsGoal = SavingsGoal(allSavingsGoals[i]);
            if (savingsGoal.owner() == msg.sender) {
                userSavingsGoals[counter] = allSavingsGoals[i];
                counter++;
            }
        }
        return userSavingsGoals;
    }

    /**
     * @notice Adds a token to the list of allowed tokens for savings goals
     * @param token The address of the token to add
     * @dev Only the owner can call this function
     */
    function addToken(address token) external onlyOwner {
        require(token != address(0), "Token cannot be zero address");
        require(
            !isTokenAllowed(token),
            "Token is already allowed for savings goals"
        );
        allowedTokens.push(token);
    }

    /**
     * @notice Removes a token from the list of allowed tokens for savings goals
     * @param token The address of the token to remove
     * @dev Only the owner can call this function
     */
    function removeToken(address token) external onlyOwner {
        require(token != address(0), "Token cannot be zero address");
        require(
            isTokenAllowed(token),
            "Token is not allowed for savings goals"
        );

        for (uint256 i = 0; i < allowedTokens.length; i++) {
            if (allowedTokens[i] == token) {
                allowedTokens[i] = allowedTokens[allowedTokens.length - 1];
                allowedTokens.pop();
                break;
            }
        }
    }
}
