import { useContractRead } from "wagmi";
import CONFIG from "src/configs";
import { abi as SavingsGoalAbi } from "@contracts/savings/SavingsGoal.sol/SavingsGoal.json";
import { SavingsGoal } from "@contract-types/index";

interface SavingsMeta<K, D> {
  functionName: K;
  args?: D extends (...args: any[]) => any ? Parameters<D> : unknown[];
}

export function useSavings<
  K extends keyof SavingsGoal,
  D extends SavingsGoal[K]
>(
  address: typeof CONFIG["CONTRACTS"]["SAVINGS_GOAL_FACTORY"],
  { functionName, args }: SavingsMeta<K, D>
) {
  const savingsContract = useContractRead({
    address,
    abi: SavingsGoalAbi,
    functionName,
    args,
  });

  return savingsContract;
}
