import { useContractRead, useContractWrite } from "wagmi";
import CONFIG from "src/configs";
import { abi as SavingsGoalFactoryAbi } from "@contracts/savings/SavingsGoalFactory.sol/SavingsGoalFactory.json";
import { SavingsGoalFactory } from "@contract-types/index";

interface SavingsFactoryMeta<K, D> {
  functionName: K;
  args?: D extends (...args: any[]) => any ? Parameters<D> : unknown[];
}

export function useSavingsFactoryRead<
  K extends keyof SavingsGoalFactory,
  D extends SavingsGoalFactory[K]
>({ functionName, args }: SavingsFactoryMeta<K, D>) {
  const savingsFactoryContract = useContractRead({
    address: CONFIG.CONTRACTS.SAVINGS_GOAL_FACTORY,
    abi: SavingsGoalFactoryAbi,
    functionName,
    args,
  });

  return savingsFactoryContract;
}

export function useSavingsFactoryWrite<
  K extends keyof SavingsGoalFactory,
  D extends SavingsGoalFactory[K]
>({ functionName, args }: SavingsFactoryMeta<K, D>) {
  const savingsFactoryContract = useContractWrite({
    address: CONFIG.CONTRACTS.SAVINGS_GOAL_FACTORY,
    abi: SavingsGoalFactoryAbi,
    functionName,
    args,
  });

  return savingsFactoryContract;
}
