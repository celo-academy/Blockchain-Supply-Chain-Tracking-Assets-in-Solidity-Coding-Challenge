//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SupplyChainTracking
 * @author raphaelpg
 * @notice Simple Supply Chain Tracking contract
 * Contract inherit from OpenZeppelin Ownable.sol contract to provide ownership functionnalities
 * Visit https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol
 */
contract SupplyChainTracking is Ownable {

  /**
   * Contract state variables.
   */
  uint assetCounter; // asset Id counter, incremented when a new asset is registered

  /**
  * Possible roles of the actors 
  * For example, to set an actor role as a Producer, actor's role must be registered as 0 
  */
  enum Role {
    Producer,
    Carrier,
    Retailer,
    Consumer
  }

  /**
   * Defining the struct variables Actor and Asset
   * Actor will be using the Role defined above
   */
  struct Actor {
    Role role;
    bool active;
  }

  /**
   * For simplicity here we define the Type and Origin of a product as a string
   */
  struct Asset {
    uint productId;
    string productType; 
    uint256 productionDate; // Date in Unix timestamp format 
    string origin;
    address currentHolder;
    address[] holderHistory;
  }

  /**
   * Mappings to store actors and assets
   */
  mapping(address => Actor) private actors;
  mapping(uint => Asset) public assets;

  /**
   * List of events emitted by the functions
   */
  event ActorRegistered(address actor, Role role);
  event ActorDisabled(address actor);
  event AssetRegistered(uint productId);
  event AssetTransfered(uint productId, address _from, address _to);

  /**
   * Defining specific errors
   */
  error OnlyAssetOwner();

  /**
   * Contract initialization.
   * Here we initialized the variables to their starting values
   * Msg.sender is passed as a param to the Ownable Contract to allow ownership functionnalities
   */
  constructor() 
    Ownable(msg.sender) 
  {
    /**
     * We start the asset counter at 1 for clarity purposes and ease security checks:
     * First asset ID will start at 1 avoinding possible confusion arround arrays first element
     * Assets ids below 1 and above assetCounter won't be returned by the get function
     */
    assetCounter = 1;
  }

  /**
   * Custom modifiers can be created and applied on any functions
   * Here we can apply this modifier to restrict the use of the function by the owner of the contract only
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyAssetOwner(uint _assetId) {
    if (assets[_assetId].currentHolder != msg.sender) revert OnlyAssetOwner();
    _;
  }

  /**
   * Contract functions.
   */
  /**
   * Function to register an actor
   * Call the function again to modify the role of an already registered actor
   * @param _actor The Ethereum address of the actor being registered
   * @param _role The role of the actor being registered
   */
  function registerActor(address _actor, Role _role) 
    public 
    onlyOwner 
  {
    actors[_actor] = Actor(_role, true);
    emit ActorRegistered(_actor, _role);
  }

  /**
   * Function to disable an actor
   * @param _actor The Ethereum address of the actor being registered
   */
  function disableActor(address _actor) 
    public 
    onlyOwner 
  {
    actors[_actor].active = false;
    emit ActorDisabled(_actor);
  }

  /**
   * Function to get an actor's data
   * @param _actor The Ethereum address of the actor being retrieved
   */
  function getActor(address _actor) 
    public
    view
    onlyOwner
    returns (Role, bool)
  {
    return (
      actors[_actor].role,
      actors[_actor].active
    );
  }

  /**
   * Function to register an asset
   * @param _productType The type of the new product in a string format, could be implemented as a enum list optionnaly
   * @param _productionDate The date of production of the new product in a Unix timestamp format
   * @param _origin The origing of the new product in a string format, could be implemented as a enum list and retrieved from the producers directly
   */
  function registerAsset(string calldata _productType, uint256 _productionDate, string calldata _origin) 
    public 
  {
    address _actor = msg.sender;
    require(actors[_actor].active == true, "Actor not enabled");
    require(actors[_actor].role == Role.Producer, "Actor's role must be Producer");

    uint _currentAssetId = assetCounter;
    assets[_currentAssetId].productId = _currentAssetId;
    assets[_currentAssetId].productType = _productType;
    assets[_currentAssetId].productionDate = _productionDate;
    assets[_currentAssetId].origin = _origin;
    assets[_currentAssetId].currentHolder = _actor;
    assets[_currentAssetId].holderHistory.push(_actor);

    assetCounter += 1;
    emit AssetRegistered(_currentAssetId);
  }

  /**
   * Function to retrieve total number of assets
   */
  function getTotalAssetNumber()
    public
    view
    returns (uint)
  {
    return (assetCounter - 1);
  }


  /**
   * Function to retrieve an asset's data providing it's ID (simple mapping getter does not return history array)
   * @param _assetId The ID of the asset being retrieved
   */
  function getAsset(uint _assetId)
    public
    view
    returns (string memory, uint256, string memory, address, address[] memory)
  {
    require(_assetId >= 1 && _assetId < assetCounter, "Asset ID must be within valid range");
    return (
      assets[_assetId].productType,
      assets[_assetId].productionDate,
      assets[_assetId].origin,
      assets[_assetId].currentHolder,
      assets[_assetId].holderHistory
    );
  }

  /**
   * Function to retrieve an asset's current holder providing it's ID
   * @param _assetId The ID of the asset being retrieved
   */
  function getAssetCurrentHolder(uint _assetId)
    public
    view
    returns (address)
  {
    require(_assetId >= 1 && _assetId < assetCounter, "Asset ID must be within valid range");
    return (
      assets[_assetId].currentHolder
    );
  }

  /**
   * Function to retrieve an asset's holder history providing it's ID
   * @param _assetId The ID of the asset being retrieved
   */
  function getAssetHolderHistory(uint _assetId)
    public
    view
    returns (address[] memory)
  {
    require(_assetId >= 1 && _assetId < assetCounter, "Asset ID must be within valid range");
    return (
      assets[_assetId].holderHistory
    );
  }

  /**
   * Function to transfer an asset to the next actor
   * @param _assetId The ID of the asset being transferred
   * @param _newHolder The ethereum address of the next holder
   */
  function transferAsset(uint _assetId, address _newHolder)
    public
    onlyAssetOwner(_assetId)
  {
    address currentHolder = msg.sender;
    require(_assetId >= 1 && _assetId < assetCounter, "Asset ID must be within valid range");
    require(actors[_newHolder].active == true, "Next owner is not valid");
    require(actors[currentHolder].role != Role.Consumer, "Consumer can not transfer asset");
    require(uint8(actors[_newHolder].role) == uint8(actors[currentHolder].role) + 1, "Wrong next owner role");

    assets[_assetId].currentHolder = _newHolder;
    assets[_assetId].holderHistory.push(_newHolder);
    emit AssetTransfered(_assetId, currentHolder, _newHolder);
  }
}