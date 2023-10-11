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

  describe("Test Product functions", async function () {
    it("Should allow a Producer to register a new asset", async function () {
      const { supplyChainTracking, addr1 } = await loadFixture(deploySupplyChainTrackingFixture);
      await supplyChainTracking.registerActor(addr1.address, 0);
      const currentTimestamp = Date.now().toString();

      const result = await supplyChainTracking.connect(addr1).registerAsset("Battery", currentTimestamp, "Curitiba");
      await expect(result).to.emit(supplyChainTracking, 'AssetRegistered');
    })
    
    it("Should not allow an unregistered Producer to register a new asset", async function () {
      const { supplyChainTracking, addr2 } = await loadFixture(deploySupplyChainTrackingFixture);
      const currentTimestamp = Date.now().toString();

      const result = supplyChainTracking.connect(addr2).registerAsset("Battery", currentTimestamp, "Curitiba");
      await expect(result).to.be.revertedWith("Actor not enabled");
    })

    it("Should not allow an actor without Producer role to register a new asset", async function () {
      const { supplyChainTracking, addr1 } = await loadFixture(deploySupplyChainTrackingFixture);
      await supplyChainTracking.registerActor(addr1.address, 1);
      const currentTimestamp = Date.now().toString();
      
      const result = supplyChainTracking.connect(addr1).registerAsset("Battery", currentTimestamp, "Curitiba");
      await expect(result).to.be.revertedWith("Actor's role must be Producer");
    })

    it("Should return the total number of assets", async function () {
      const { supplyChainTracking, addr1 } = await loadFixture(deploySupplyChainTrackingFixture);
      expect(await supplyChainTracking.getTotalAssetNumber()).to.equal(0);
      
      await supplyChainTracking.registerActor(addr1.address, 0);
      const currentTimestamp = Date.now().toString();
      
      await supplyChainTracking.connect(addr1).registerAsset("Battery", currentTimestamp, "Curitiba");
      await supplyChainTracking.connect(addr1).registerAsset("Screen", currentTimestamp, "Santiago");
      expect(await supplyChainTracking.getTotalAssetNumber()).to.equal(2);
    })
    
    it("Should return an asset's data providing it's id", async function () {
      const { supplyChainTracking, addr1 } = await loadFixture(deploySupplyChainTrackingFixture);
      await supplyChainTracking.registerActor(addr1.address, 0);

      const assetType = "Tyre";
      const assetProductionDate = Date.now().toString();
      const assetOrigin = "Buenos Aires";
      const assetData = [assetType, BigInt(assetProductionDate), assetOrigin, addr1.address, [addr1.address]];

      await supplyChainTracking.connect(addr1).registerAsset(assetType, assetProductionDate, assetOrigin);

      const result = await supplyChainTracking.getAsset(1);
      expect(result).to.deep.equal(assetData);
    })

    it("Should revert data retrieval if asset does not exists", async function () {
      const { supplyChainTracking, addr1 } = await loadFixture(deploySupplyChainTrackingFixture);
      await supplyChainTracking.registerActor(addr1.address, 0)
      const currentTimestamp = Date.now().toString();
      await supplyChainTracking.connect(addr1).registerAsset("Battery", currentTimestamp, "Curitiba");

      const resultInf = supplyChainTracking.getAsset(0);
      await expect(resultInf).to.be.revertedWith("Asset ID must be within valid range")
      const resultSup = supplyChainTracking.getAsset(2);
      await expect(resultSup).to.be.revertedWith("Asset ID must be within valid range")
    })

    it("Should revert data retrieval if asset list is empty", async function () {
      const { supplyChainTracking, addr1 } = await loadFixture(deploySupplyChainTrackingFixture);
      await supplyChainTracking.registerActor(addr1.address, 0);
      
      const result = supplyChainTracking.getAsset(1);
      await expect(result).to.be.revertedWith("Asset ID must be within valid range")
    })
    
  });
});