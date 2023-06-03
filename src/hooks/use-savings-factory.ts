import { useContractRead, useContractWrite } from "wagmi";
import CONFIG from "src/configs";
import SavingsGoalFactoryData from "@contracts/savings/SavingsGoalFactory.sol/SavingsGoalFactory.json";
import { SavingsGoalFactory } from "@contract-types/index";
import { ContractMeta, ContractResult } from "./types";

export function useSavingsFactoryRead<
  R extends ContractResult<D>,
  K extends keyof SavingsGoalFactory = keyof SavingsGoalFactory,
  D extends SavingsGoalFactory[K] = SavingsGoalFactory[K]
>({ functionName, args }: ContractMeta<K, D>) {
  const { data, ...rest } = useContractRead({
    address: CONFIG.CONTRACTS.SAVINGS_GOAL_FACTORY,
    abi: SavingsGoalFactoryData.abi,
    functionName,
    args,
  });

  return { data: data as R, ...rest };
}

export function useSavingsFactoryWrite<
  R extends ContractResult<D>,
  K extends keyof SavingsGoalFactory = keyof SavingsGoalFactory,
  D extends SavingsGoalFactory[K] = SavingsGoalFactory[K]
>({ functionName, args }: ContractMeta<K, D>) {
  const { data, ...rest } = useContractWrite({
    address: CONFIG.CONTRACTS.SAVINGS_GOAL_FACTORY,
    abi: SavingsGoalFactoryData.abi,
    functionName,
    args,
  });

  return { data: data as R, ...rest };
}
