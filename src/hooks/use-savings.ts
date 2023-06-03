import { useContractReads } from "wagmi";
import SavingsGoalData from "@contracts/savings/SavingsGoal.sol/SavingsGoal.json";
import { SavingsGoal } from "@contract-types/index";
import { ContractAddress, ContractMeta, ContractResult } from "./types";

type MappedContractResult<K extends keyof SavingsGoal> = {
  [key in K]: ContractResult<SavingsGoal[key]>;
};

type SavingsInfo<K extends keyof SavingsGoal> = MappedContractResult<K> & {
  address: ContractAddress;
};

export function useSavings<
  K extends keyof SavingsGoal = keyof SavingsGoal,
  D extends SavingsGoal[K] = SavingsGoal[K]
>(addresses: ContractAddress[], metaList: ContractMeta<K, D>[]) {
  const { data, ...rest } = useContractReads({
    // @ts-expect-error We're inferring the type for args
    contracts: addresses.flatMap((address) =>
      metaList.map((meta) => ({
        ...meta,
        address,
        abi: SavingsGoalData.abi as never,
      }))
    ),
  });

  const savingsInfo = addresses.map(
    (address, index) =>
      ({
        address,
        ...metaList.reduce(
          (accMeta, meta, mIndex) => ({
            ...accMeta,
            [meta.functionName]: data?.[index + mIndex].result,
          }),
          {}
        ),
      } as SavingsInfo<typeof metaList[number]["functionName"]>)
  );

  return { data: savingsInfo, ...rest };
}
