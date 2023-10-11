const { expect } = require("chai");

const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("SupplyChainTracking tests", function () {

  // Deploy contract and return the contract instance and accounts
  async function deploySupplyChainTrackingFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const supplyChainTracking = await ethers.deployContract("SupplyChainTracking");
    
    await supplyChainTracking.waitForDeployment();
    
    return { owner, addr1, addr2, supplyChainTracking };
  }

  describe("Test deployment", async function () {
    it("Should deploy SupplyChainTracking", async function () {
      const { supplyChainTracking, owner } = await loadFixture(deploySupplyChainTrackingFixture);

      expect(await supplyChainTracking.owner()).to.equal(owner.address);
    });
  });
});