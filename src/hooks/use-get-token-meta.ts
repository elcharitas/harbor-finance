import { useContractReads } from "wagmi";
import TDaiData from "@contracts/tokens/TDai.sol/TDai.json";
import { ContractAddress } from "./types";

interface TokenMetaOptions {
  tokens: ContractAddress[] | undefined;
}

interface TokenMetaResult {
  data:
    | {
        name?: string;
        symbol?: string;
        address: ContractAddress;
      }[]
    | undefined;
  isLoading: boolean;
  isError: boolean;
}

const META_INFO_FUNCTIONS = ["name", "symbol"];

export function useGetTokensMeta({
  tokens,
}: TokenMetaOptions): TokenMetaResult {
  const { data, isLoading, isError } = useContractReads({
    contracts: META_INFO_FUNCTIONS.map((functionName) =>
      tokens?.map((address) => ({
        address,
        abi: TDaiData.abi as never,
        functionName,
      }))
    ).flat(),
  });

  const tokenInfo = tokens?.map((address, index) => ({
    address,
    ...META_INFO_FUNCTIONS.reduce(
      (accMeta, functionName) => ({
        ...accMeta,
        [functionName]: data?.[index].result,
      }),
      {}
    ),
  }));

  return { data: tokenInfo, isLoading, isError };
}
