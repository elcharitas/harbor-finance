import { useContractRead } from "wagmi";
import CONFIG from "src/configs";
import { abi as SavingsGoalAbi } from "@contracts/savings/SavingsGoal.sol/SavingsGoal.json";
import { SavingsGoal } from "@contract-types/index";
import { ContractMeta, ContractResult } from "./types";

export function useSavings<
  R extends ContractResult<D>,
  K extends keyof SavingsGoal = keyof SavingsGoal,
  D extends SavingsGoal[K] = SavingsGoal[K]
>(
  address: typeof CONFIG["CONTRACTS"]["SAVINGS_GOAL_FACTORY"],
  { functionName, args }: ContractMeta<K, D>
) {
  const { data, ...rest } = useContractRead({
    address,
    abi: SavingsGoalAbi,
    functionName,
    args,
  });

  return { data: data as R, ...rest };
}
