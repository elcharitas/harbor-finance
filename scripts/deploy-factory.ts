import { BigNumberish } from "ethers";
import { ethers, network } from "hardhat";
import { buildEnvVariables } from "./build-env";

async function main() {
  const SavingsGoalFactory = await ethers.getContractFactory(
    "SavingsGoalFactory"
  );
  const TDai = await ethers.getContractFactory("TDai");

  // deploy the factory
  const savingsGoalFactory = await SavingsGoalFactory.deploy();
  await savingsGoalFactory.deployed();

  // deploy the token
  const daiToken = await TDai.deploy();
  await daiToken.deployed();

  // add the token to the factory
  await savingsGoalFactory.addToken(daiToken.address);

  console.log(`SavingsGoalFactory deployed to ${savingsGoalFactory.address}`);

  // get current chain id using eth_chainId RPC call
  const chainId = (await network.provider.request({
    method: "eth_chainId",
  })) as BigNumberish;

  return {
    NETWORK_ID: ethers.utils.formatUnits(chainId, 0),
    DAI_TOKEN_ADDRESS: daiToken.address,
    SAVINGS_GOAL_FACTORY_ADDRESS: savingsGoalFactory.address,
  };
}

// Run the deployment script
main()
  .then(buildEnvVariables) // build the .env.local file
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
