import { useContractWrite } from "wagmi";
import CONFIG from "src/configs";
import { abi as SavingsGoalFactoryAbi } from "@contracts/savings/SavingsGoalFactory.sol/SavingsGoalFactory.json";

interface SavingsGoalOptions {
  tokenAddress: string;
  goalAmount: string;
  daysToReachGoal: number;
  goalName?: string;
  goalDescription?: string;
}

export function useCreateGoal() {
  const { writeAsync, ...rest } = useContractWrite({
    address: CONFIG.CONTRACTS.SAVINGS_GOAL_FACTORY,
    abi: SavingsGoalFactoryAbi,
    functionName: "createSavingsGoal",
  });

  const createGoal = async ({
    tokenAddress,
    goalAmount,
    daysToReachGoal,
    goalName = "New Saving Goal",
    goalDescription = "",
  }: SavingsGoalOptions) => {
    await writeAsync({
      args: [
        tokenAddress,
        goalAmount,
        daysToReachGoal,
        goalName,
        goalDescription,
      ],
    });
  };

  return { createGoal, ...rest };
}
