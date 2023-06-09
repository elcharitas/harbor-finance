// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
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
    address[] private allAllowedTokens;

    mapping(address => uint256) private allowedTokens;
    mapping(address => bool) public hasUserApproved;

    event SavingsGoalCreated(
        address indexed savingsGoal,
        address indexed creator
    );

    event SavingGoalFunded(
        address indexed savingsGoal,
        address indexed funder,
        uint256 amount
    );

    constructor() {}

    /**
     * @notice Checks if a token is allowed for savings goals
     * @param token The address of the token to check
     */
    function isTokenAllowed(address token) public view returns (bool) {
        return allowedTokens[token] > 0;
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
                addFunds(savingsGoals[i]);
            }
        }
    }

    function addFunds(address goal) internal onlyOwner {
        SavingsGoal savingsGoal = SavingsGoal(payable(goal));
        require(savingsGoal.startTimestamp() > 0, "Goal has not started yet");

        uint256 elapsedTime = block.timestamp - savingsGoal.startTimestamp();
        require(
            elapsedTime <= savingsGoal.timeToReachGoal(),
            "Goal period has ended"
        );

        IERC20 dai = IERC20(savingsGoal.token());

        uint256 goalBalance = dai.balanceOf(address(this));
        require(
            goalBalance < savingsGoal.goalAmount(),
            "Goal has been reached"
        );

        uint256 amountToAdd = savingsGoal.goalAmount() /
            savingsGoal.daysToReachGoal();
        require(
            goalBalance + amountToAdd <= savingsGoal.goalAmount(),
            "Goal amount has already been reached"
        );

        dai.transferFrom(address(this), goal, amountToAdd);

        emit SavingGoalFunded(goal, address(this), amountToAdd);
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
        string memory goalDescription,
        bytes calldata permitData
    ) external whenNotPaused {
        require(
            isTokenAllowed(daiToken),
            "Token is not allowed for savings goals"
        );

        if (!hasUserApproved[msg.sender]) {
            require(permitData.length > 0, "Permit data must not be empty");
            (
                address owner,
                address spender,
                uint256 value,
                uint256 nonce,
                uint256 deadline,
                uint8 v,
                bytes32 r,
                bytes32 s
            ) = abi.decode(
                    permitData,
                    (
                        address,
                        address,
                        uint256,
                        uint256,
                        uint256,
                        uint8,
                        bytes32,
                        bytes32
                    )
                );
            require(owner == msg.sender, "Permit owner must be the sender");
            require(
                spender == address(this),
                "Permit spender must be this contract"
            );
            require(
                value >= goalAmount,
                "Permit value must be greater than or equal to goal amount"
            );
            require(
                deadline >= block.timestamp,
                "Permit deadline must not have passed"
            );

            IERC20Permit dai = IERC20Permit(daiToken);
            dai.permit(owner, spender, value, deadline, v, r, s);
            hasUserApproved[msg.sender] = true;
        }

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
     * @notice Gets all the tokens allowed for savings goals
     */
    function getAllAllowedTokens() external view returns (address[] memory) {
        return allAllowedTokens;
    }

    /**
     * @notice Gets all the savings goals created by a user
     */
    function getUserSavingsGoals() external view returns (address[] memory) {
        uint256 savingsGoalsLength = allSavingsGoals.length;
        uint256 counter = 0;
        address[] memory userSavingsGoals = new address[](savingsGoalsLength);

        for (uint256 i = 0; i < savingsGoalsLength; i++) {
            SavingsGoal savingsGoal = SavingsGoal(payable(allSavingsGoals[i]));

            if (savingsGoal.owner() == msg.sender) {
                userSavingsGoals[counter] = address(savingsGoal);
                counter++;
            }
        }

        // Resize the userSavingsGoals array to match the actual number of savings goals
        assembly {
            mstore(userSavingsGoals, counter)
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
        allAllowedTokens.push(token);
        allowedTokens[token] = allAllowedTokens.length;
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

        uint256 tokenIndex = allowedTokens[token] - 1;
        allAllowedTokens[tokenIndex] = allAllowedTokens[
            allAllowedTokens.length - 1
        ];
        allAllowedTokens.pop();

        delete allowedTokens[token];
    }

    /**
     * @notice toggle pause state of the factory
     */
    function togglePause() external onlyOwner {
        if (paused()) {
            _unpause();
        } else {
            _pause();
        }
    }
}
