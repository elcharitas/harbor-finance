import { expect } from "chai";
import { ethers } from "hardhat";
import { SavingsGoal, TDai } from "@contract-types/index";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("SavingsGoal", function () {
  let daiToken: TDai;
  let savingsGoal: SavingsGoal;
  let owner: SignerWithAddress;
  let signers: SignerWithAddress[];

  beforeEach(async function () {
    const daiTokenFactory = await ethers.getContractFactory("TDai");
    const SavingsGoal = await ethers.getContractFactory("SavingsGoal");
    [owner, ...signers] = await ethers.getSigners();

    const goalAmount = ethers.utils.parseEther("1000");
    const daysToReachGoal = 30;
    const goalName = "New Laptop";
    const goalDescription = "Save up for a new laptop";

    daiToken = await daiTokenFactory.deploy();
    await daiToken.deployed();

    savingsGoal = await SavingsGoal.deploy(
      daiToken.address,
      goalAmount,
      daysToReachGoal,
      goalName,
      goalDescription
    );
    await savingsGoal.deployed();

    await daiToken.connect(owner).approve(savingsGoal.address, goalAmount);
  });

  describe(".owner()", function () {
    it("should set the right owner", async function () {
      expect(await savingsGoal.owner()).to.equal(owner.address);
    });
  });

  describe(".addFunds()", function () {
    it("should allow funding to the goal", async function () {
      await savingsGoal.addFunds();
      expect(await savingsGoal.balance()).to.be.greaterThan(0);
    });
  });

  describe(".withdraw()", function () {
    it("should revert if not called by the owner", async function () {
      expect(savingsGoal.connect(signers[0]).withdraw()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("should not withdraw from a savings goal if not reached", async function () {
      await savingsGoal.addFunds();
      expect(savingsGoal.withdraw()).to.be.revertedWith("Goal not reached");
    });
  });
});
