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

  it("should create a savings goal", async function () {
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

    const allSavingsGoals = await savingsGoalFactory.getAllSavingsGoals();
    expect(allSavingsGoals.length).to.equal(1);

    const userSavingsGoals = await savingsGoalFactory.getUserSavingsGoals();
    expect(userSavingsGoals.length).to.equal(1);
  });

  it("should add a token to the list of allowed tokens", async function () {
    await savingsGoalFactory.connect(owner).addToken(daiToken.address);

    const isAllowed = await savingsGoalFactory.isTokenAllowed(daiToken.address);
    expect(isAllowed).to.be.true;
  });

  it("should remove a token from the list of allowed tokens", async function () {
    await savingsGoalFactory.connect(owner).addToken(daiToken.address);

    await savingsGoalFactory.connect(owner).removeToken(daiToken.address);

    const isAllowed = await savingsGoalFactory.isTokenAllowed(daiToken.address);
    expect(isAllowed).to.be.false;
  });

  it("should not allow a non-owner to add a token", async function () {
    const [, nonOwner] = await ethers.getSigners();
    await expect(
      savingsGoalFactory.connect(nonOwner).addToken(daiToken.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("should not allow a non-owner to remove a token", async function () {
    const [, nonOwner] = await ethers.getSigners();
    await expect(
      savingsGoalFactory.connect(nonOwner).removeToken(daiToken.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("should checkUpkeep and return false at first", async function () {
    const [upkeepNeeded] = await savingsGoalFactory.checkUpkeep("0x");
    expect(upkeepNeeded).to.be.false;
  });

  it("should checkUpkeep and return the correct values", async function () {
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

    const [upkeepNeeded, performData] = await savingsGoalFactory.checkUpkeep(
      "0x"
    );
    expect(upkeepNeeded).to.be.true;

    const allSavingsGoals = await savingsGoalFactory.getAllSavingsGoals();
    const performDataParsed = ethers.utils.defaultAbiCoder.decode(
      ["address[]"],
      performData
    );
    expect(performDataParsed[0][0]).to.equal(allSavingsGoals[0]);
  });
});
