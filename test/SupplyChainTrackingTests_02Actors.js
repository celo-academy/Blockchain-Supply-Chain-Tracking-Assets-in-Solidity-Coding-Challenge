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

  describe("Test Actors functions", async function () {
    it("Should add an actor", async function () {
      const { supplyChainTracking, addr1 } = await loadFixture(deploySupplyChainTrackingFixture);

      const result = await supplyChainTracking.registerActor(addr1.address, 1);
      expect(result).to.emit(supplyChainTracking, 'ActorRegistered');
    })
    
    it("Should disable an actor", async function () {
      const { supplyChainTracking, addr1 } = await loadFixture(deploySupplyChainTrackingFixture);

      await supplyChainTracking.registerActor(addr1.address, 1);
      expect(await supplyChainTracking.disableActor(addr1.address)).to.emit(supplyChainTracking, 'ActorDisabled');
    })
    
    it("Should not allow unauthorized address to register an actor", async function () {
      const { supplyChainTracking, addr1 } = await loadFixture(deploySupplyChainTrackingFixture);

      const unauthorizedRegistration = supplyChainTracking.connect(addr1).registerActor(addr1.address, 1);
      await expect(unauthorizedRegistration).to.be.revertedWithCustomError(supplyChainTracking, "OwnableUnauthorizedAccount");
    })

    it("Should not allow unauthorized address to disable an actor", async function () {
      const { supplyChainTracking, addr1, addr2 } = await loadFixture(deploySupplyChainTrackingFixture);
      
      await supplyChainTracking.registerActor(addr1.address, 1);
      const unauthorizedDisabling = supplyChainTracking.connect(addr2).disableActor(addr1.address);
      await expect(unauthorizedDisabling).to.be.revertedWithCustomError(supplyChainTracking, "OwnableUnauthorizedAccount");
    })
    
    it("Should get an actor's data", async function () {
      const { supplyChainTracking, addr1, addr2 } = await loadFixture(deploySupplyChainTrackingFixture);

      const actor = addr1.address;
      const role = 1;

      await supplyChainTracking.registerActor(actor, role);

      const [returnedRole, returnedStatus] = await supplyChainTracking.getActor(actor);

      expect(returnedRole.toString()).to.equal("1");
      expect(returnedStatus).to.equal(true);
    })

    it("Should not allow unauthorized address get an actor's data", async function () {
      const { supplyChainTracking, addr1, addr2 } = await loadFixture(deploySupplyChainTrackingFixture);

      const actor = addr1.address;
      const role = 1;

      await supplyChainTracking.registerActor(actor, role);

      const actorAdata = supplyChainTracking.connect(addr2).getActor(actor);
      await expect(actorAdata).to.be.revertedWithCustomError(supplyChainTracking, "OwnableUnauthorizedAccount");
    })
  });
});