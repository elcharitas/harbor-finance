import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { SavingsGoalFactory, TDai } from "@contract-types/index";

describe("SavingsGoalFactory", function () {
  let daiToken: TDai;
  let savingsGoalFactory: SavingsGoalFactory;
  let owner: SignerWithAddress;

  beforeEach(async function () {
    const daiTokenFactory = await ethers.getContractFactory("TDai");
    const SavingsGoalFactory = await ethers.getContractFactory(
      "SavingsGoalFactory"
    );

    [owner] = await ethers.getSigners();
    savingsGoalFactory = await SavingsGoalFactory.deploy();
    daiToken = await daiTokenFactory.deploy();

    // send some token to the factory
    await daiToken.connect(owner).transfer(savingsGoalFactory.address, 10000);
  });

  it("Should create a savings goal", async function () {
    const goalAmount = ethers.utils.parseEther("1000");
    const daysToReachGoal = 30;
    const goalName = "New Laptop";
    const goalDescription = "Save up for a new laptop";

    await savingsGoalFactory.connect(owner).addToken(daiToken.address);

    await savingsGoalFactory
      .connect(owner)
      .createSavingsGoal(
        daiToken.address,
        goalAmount,
        daysToReachGoal,
        goalName,
        goalDescription
      );

    // permit the factory to spend the dai token
    await daiToken
      .connect(owner)
      .permit(
        owner.address,
        savingsGoalFactory.address,
        10000,
        daysToReachGoal * 24 * 60 * 60,
        0,
        "0x0",
        "0x0"
      );

    const allSavingsGoals = await savingsGoalFactory.getAllSavingsGoals();
    expect(allSavingsGoals.length).to.equal(1);

    const userSavingsGoals = await savingsGoalFactory.getUserSavingsGoals();
    expect(userSavingsGoals.length).to.equal(1);
  });

  it("Should add a token to the list of allowed tokens", async function () {
    await savingsGoalFactory.connect(owner).addToken(daiToken.address);

    const isAllowed = await savingsGoalFactory.isTokenAllowed(daiToken.address);
    expect(isAllowed).to.be.true;
  });

  it("Should remove a token from the list of allowed tokens", async function () {
    await savingsGoalFactory.connect(owner).addToken(daiToken.address);

    await savingsGoalFactory.connect(owner).removeToken(daiToken.address);

    const isAllowed = await savingsGoalFactory.isTokenAllowed(daiToken.address);
    expect(isAllowed).to.be.false;
  });
});
