// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";
import "./SavingsGoal.sol";

/**
 * SavingsGoalFactory contract
 *
 * @notice SavingsGoalFactory is a contract that allows users to create savings goals
 * It implements the Chainlink Keeper network to allow for automated funding/saving
 * @author elcharitas <jonathanirhodia@gmail.com> - https://links.dev/elcharitas
 */
contract SavingsGoalFactory is KeeperCompatibleInterface, Ownable, Pausable {
    address[] private allSavingsGoals;

    mapping(address => bool) public allowedTokens;

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
        return allowedTokens[token];
    }

    /**
     * @notice Checks if the contract requires work to be done
     */
    function checkUpkeep(
        bytes memory /* checkData */
    ) public view override whenNotPaused returns (bool, bytes memory) {
        uint256 batchSize = 100; // Define the batch size
        uint256 savingsGoalsLength = allSavingsGoals.length;

        if (savingsGoalsLength == 0) {
            return (false, "");
        }

        for (uint256 i = 0; i < savingsGoalsLength; i += batchSize) {
            uint256 endIndex = i + batchSize > savingsGoalsLength
                ? savingsGoalsLength
                : i + batchSize;
            address[] memory batch = new address[](endIndex - i);

            for (uint256 j = i; j < endIndex; j++) {
                SavingsGoal savingsGoal = SavingsGoal(
                    payable(allSavingsGoals[j])
                );
                if (
                    (block.timestamp - savingsGoal.startTimestamp()) % 1 days ==
                    0
                ) {
                    batch[j - i] = address(savingsGoal);
                }
            }

            if (batch.length > 0) {
                return (true, abi.encode(batch));
            }
        }

        return (false, "");
    }

    /**
     * @notice Performs the work on the contract, if instructed by :checkUpkeep():
     * @param performData The data returned by the checkData
     */
    function performUpkeep(
        bytes calldata performData // bytes encoded array of savings goals
    ) external override whenNotPaused {
        // Decode the savings goals
        address[] memory savingsGoals = abi.decode(performData, (address[]));

        for (uint256 i = 0; i < savingsGoals.length; i++) {
            SavingsGoal savingsGoal = SavingsGoal(payable(savingsGoals[i]));

            if (!savingsGoal.isGoalReached()) {
                savingsGoal.addFunds();
            }
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
    ) external whenNotPaused {
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
        uint256 savingsGoalsLength = allSavingsGoals.length;

        assembly {
            // Counter for the user savings goals
            let counter := 0
            for {
                let i := 0
            } lt(i, savingsGoalsLength) {
                i := add(i, 1)
            } {
                // Get the savings goal
                let savingsGoal := sload(add(allSavingsGoals.slot, i))
                let savingsGoalOwner := sload(add(savingsGoal, 1))
                // Check if the savings goal belongs to the caller
                if eq(savingsGoalOwner, caller()) {
                    // Add the savings goal to the array
                    mstore(
                        add(userSavingsGoals, add(counter, 0x20)),
                        savingsGoal
                    )
                    counter := add(counter, 1)
                }
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
        allowedTokens[token] = true;
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

        delete allowedTokens[token];
    }
}
