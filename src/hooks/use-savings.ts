import { useQuery, useBlockNumber, useChainId } from "wagmi";
import { readContract } from "@wagmi/core";
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
>(addresses: ContractAddress[] | undefined, metaList: ContractMeta<K, D>[]) {
  const { data: blockNumber } = useBlockNumber({
    enabled: true,
    watch: true,
  });
  const chainId = useChainId();

  const { data, ...rest } = useQuery(
    [
      {
        entity: "contracts",
        contracts:
          addresses?.flatMap((address) =>
            metaList.map((meta) => ({
              ...meta,
              address,
              abi: SavingsGoalData.abi,
            }))
          ) ?? [],
        chainId,
        blockNumber,
      },
    ],
    {
      queryFn: ({ queryKey: [{ contracts, blockNumber, chainId }] }) => {
        return Promise.all(
          contracts.map(async (contract) => ({
            [contract.functionName]: {
              value: await readContract({
                ...contract,
                blockNumber,
                chainId,
              }),
              address: contract.address,
            },
          }))
        );
      },
    }
  );

  const savingsInfo =
    data &&
    addresses?.map(
      (address) =>
        ({
          address,
          ...metaList.reduce(
            (accMeta, meta, mIndex) => ({
              ...accMeta,
              [meta.functionName]: data?.find(
                (d) =>
                  d[meta.functionName] &&
                  d[meta.functionName].address === address
              )?.[meta.functionName].value,
            }),
            {}
          ),
        } as SavingsInfo<typeof metaList[number]["functionName"]>)
    );

  return { data: savingsInfo, ...rest };
}
