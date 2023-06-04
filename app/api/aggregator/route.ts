import { NextResponse } from "next/server";
import { ethers } from "ethers";
import CONFIG from "src/configs";
import {
  AggregatorV3Interface,
  fetchHistoricalData,
  getContractAddress,
  provider,
} from "src/utils/chainlink";

export async function GET(request: Request) {
  if (CONFIG.APP.IS_DEV) {
    return NextResponse.json({});
  }

  const routeUrl = new URL(request.url);

  const contractSymbol = routeUrl.searchParams.get("contract");
  const days = Number(routeUrl.searchParams.get("days") || "1");

  if (!contractSymbol) {
    return NextResponse.json(
      {
        error: "Please specify contract symbol. E.g DAI",
      },
      {
        status: 400,
      }
    );
  }

  const proxyAddress = await getContractAddress(contractSymbol);

  if (!proxyAddress) {
    return NextResponse.json(
      {
        error: "Contract not found.",
      },
      {
        status: 404,
      }
    );
  }

  const endTime = Date.now() / 1000;
  const startTime = endTime - 86400 * days;

  const contract = new ethers.Contract(
    proxyAddress,
    AggregatorV3Interface,
    provider
  );

  const dataByDate = await fetchHistoricalData(contract, startTime);

  return NextResponse.json(dataByDate);
}
