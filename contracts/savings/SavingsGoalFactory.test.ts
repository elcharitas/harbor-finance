import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { SavingsGoalFactory, TDai } from "@contract-types/index";

describe("SavingsGoalFactory", function () {
  let daiToken: TDai;
  let savingsGoalFactory: SavingsGoalFactory;
  let owner: SignerWithAddress;
  let signers: SignerWithAddress[];

  beforeEach(async function () {
    const daiTokenFactory = await ethers.getContractFactory("TDai");
    const SavingsGoalFactory = await ethers.getContractFactory(
      "SavingsGoalFactory"
    );

    [owner, ...signers] = await ethers.getSigners();
    savingsGoalFactory = await SavingsGoalFactory.deploy();
    daiToken = await daiTokenFactory.deploy();

    // send some token to the factory
    await daiToken.connect(owner).transfer(savingsGoalFactory.address, 10000);
  });

  describe(".owner()", function () {
    it("should set the right owner", async function () {
      expect(await savingsGoalFactory.owner()).to.equal(owner.address);
    });
  });

  describe(".createSavingsGoal()", function () {
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
      expect(
        (await savingsGoalFactory.connect(signers[0]).getUserSavingsGoals())
          .length
      ).to.equal(0);
    });
  });

  describe(".addToken()", function () {
    it("should add a token to the list of allowed tokens", async function () {
      await savingsGoalFactory.connect(owner).addToken(daiToken.address);

      const isAllowed = await savingsGoalFactory.isTokenAllowed(
        daiToken.address
      );
      expect(isAllowed).to.be.true;
    });

    it("should not allow a non-owner to add a token", async function () {
      const [, nonOwner] = await ethers.getSigners();
      await expect(
        savingsGoalFactory.connect(nonOwner).addToken(daiToken.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe(".removeToken()", function () {
    it("should remove a token from the list of allowed tokens", async function () {
      await savingsGoalFactory.connect(owner).addToken(daiToken.address);

      await savingsGoalFactory.connect(owner).removeToken(daiToken.address);

      const isAllowed = await savingsGoalFactory.isTokenAllowed(
        daiToken.address
      );
      expect(isAllowed).to.be.false;
    });

    it("should not allow a non-owner to remove a token", async function () {
      const [, nonOwner] = await ethers.getSigners();
      await expect(
        savingsGoalFactory.connect(nonOwner).removeToken(daiToken.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe(".checkUpkeep()", function () {
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
      const [performDataParsed] = ethers.utils.defaultAbiCoder.decode(
        ["address[]"],
        performData
      ) as [string[]];
      expect(performDataParsed[0]).to.equal(allSavingsGoals[0]);
    });
  });

  describe(".performUpkeep()", function () {
    it("should performUpkeep correctly", async function () {
      const goalAmount = ethers.utils.parseEther("1000");
      const expectedBalance = ethers.utils.parseEther("100");
      const daysToReachGoal = 10;
      const goalName = "New Laptop";
      const goalDescription = "Save up for a new laptop";

      await savingsGoalFactory.connect(owner).addToken(daiToken.address);
      await daiToken
        .connect(owner)
        .approve(savingsGoalFactory.address, goalAmount);

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

      const [performDataParsed] = ethers.utils.defaultAbiCoder.decode(
        ["address[]"],
        performData
      ) as [string[]];
      const goal = performDataParsed[0];
      const goalContract = await ethers.getContractAt("SavingsGoal", goal);

      // allow the goal contract to transfer dai
      await daiToken.connect(owner).approve(goal, goalAmount);

      expect(await goalContract.isGoalReached()).to.be.false;

      await savingsGoalFactory.performUpkeep(performData);

      const balance = await goalContract.balance();
      expect(balance).to.equal(expectedBalance);
    });
  });
});
