import AggregatorV3Abi from "@chainlink/contracts/abi/v0.8/AggregatorV3Interface.json";
import { BigNumber, ethers } from "ethers";
import CONFIG from "src/configs";

export const AggregatorV3Interface = new ethers.utils.Interface(
  AggregatorV3Abi
);
export const provider = new ethers.providers.JsonRpcProvider(
  CONFIG.NETWORK.RPC_URL
);

function toNumber(bigNumber: BigNumber, unit: string | number = "wei") {
  return Number(ethers.utils.formatUnits(bigNumber, unit));
}

async function getRoundData(
  contract: ethers.Contract,
  roundId: BigNumber
) {
  const roundData = await contract.getRoundData(roundId);
  return {
    answer: roundData.answer,
    updatedAt: toNumber(roundData.updatedAt),
  };
}

export async function fetchFeedsData() {
  const response = await fetch(
    "https://reference-data-directory.vercel.app/feeds-matic-testnet.json"
  );
  return (await response.json()) as
    | Record<"proxyAddress" | "name", string>[]
    | undefined;
}

export async function getContractAddress(contractSymbol: string) {
  const data = await fetchFeedsData();
  const { proxyAddress } =
    data?.find((feed) => feed.name.match(new RegExp(contractSymbol, "i"))) ||
    {};
  return proxyAddress;
}

export async function fetchHistoricalData(
  contract: ethers.Contract,
  startTime: number
) {
  const latestRoundData = await contract.latestRoundData();
  let roundId = latestRoundData.roundId as BigNumber;
  let timestamp = toNumber(latestRoundData.updatedAt);

  const dataByDate: Record<string, number[]> = {};

  while (timestamp > startTime) {
    roundId = roundId.sub(BigNumber.from(1));
    const roundData = await getRoundData(contract, roundId);
    timestamp = roundData.updatedAt;

    const date = new Date(timestamp * 1000).toISOString().split("T")[0];

    if (!dataByDate[date]) {
      dataByDate[date] = [];
    }

    dataByDate[date].push(toNumber(roundData.answer, 8));
  }

  return dataByDate;
}
