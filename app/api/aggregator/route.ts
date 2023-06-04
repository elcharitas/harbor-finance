import { NextResponse } from "next/server";
import AggregatorV3Abi from "@chainlink/contracts/abi/v0.8/AggregatorV3Interface.json";
import { BigNumber, ethers } from "ethers";
import CONFIG from "src/configs";

const AggregatorV3Interface = new ethers.utils.Interface(AggregatorV3Abi);
const provider = new ethers.providers.JsonRpcProvider(CONFIG.NETWORK.RPC_URL);

/**
 * This piece of code converts a big number to number
 * @author elcharitas <https://iamelcharitas.hashnode.dev/how-to-safely-convert-bignumbers-with-ethers>
 *
 * @param bigNumber
 * @param unit
 */
function toNumber(bigNumber: BigNumber, unit: string | number = "wei") {
  return Number(ethers.utils.formatUnits(bigNumber, unit));
}

async function getRoundData(contract: ethers.Contract, roundId: BigNumber) {
  const roundData = await contract.getRoundData(roundId);
  return {
    answer: roundData.answer,
    updatedAt: toNumber(roundData.updatedAt),
  };
}

/**
 * This is a route handler which uses the QuickNode RPC Url and chainlink contracts to
 * access and return the historical price data of a stable coin aggregator
 *
 * @param request
 */
export async function GET(request: Request) {
  const routeUrl = new URL(request.url);

  const contractAddress = routeUrl.searchParams.get("contract");
  const days = parseInt(routeUrl.searchParams.get("days") || "1");

  if (!contractAddress) {
    return NextResponse.json({
      error: "Please specify contract address",
    });
  }

  const endTime = Date.now() / 1000;
  const startTime = endTime - 86400 * days;

  const contract = new ethers.Contract(
    contractAddress,
    AggregatorV3Interface,
    provider
  );
  const latestRoundData = await contract.latestRoundData();
  let roundId = latestRoundData.roundId as BigNumber;

  const result = [latestRoundData.answer];
  let timestamp = toNumber(latestRoundData.updatedAt);

  while (timestamp > startTime) {
    roundId = roundId.sub(BigNumber.from(1));
    const roundData = await getRoundData(contract, roundId);
    result.push(roundData.answer);
    timestamp = roundData.updatedAt;
  }

  return NextResponse.json(result.map((r) => toNumber(r, 8)));
}
