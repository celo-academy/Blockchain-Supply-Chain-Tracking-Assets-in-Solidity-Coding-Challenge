## Introduction

This is an answer to CELO [Blockchain-Supply-Chain-Tracking-Assets-in-Solidity-Coding-Challenge](https://github.com/celo-academy/Blockchain-Supply-Chain-Tracking-Assets-in-Solidity-Coding-Challenge) developed with Hardhat, the contract is coded in Solidity and tests in JavaScript.

The main purpose of this repository is to provide an educational example for a basic Supply Chain problem, while teaching basic Solidity principles and how to test them.

Contract and tests are commented for an easy understanding.

## How to run

Clone repository and install dependencies.\
There is one contract called SupplyChainTracking.sol included in the "contracts" folder.\
Test files are included inside the "test" folder.\
To compile the contract run:
```
npx hardhat compile
```
To run the test suite:
```
npx hardhat test
```
You can also visit [https://remix.ethereum.org/](https://remix.ethereum.org/) to deploy and play with the contract.

## Challenge requirements:

Design a smart contract that facilitates a basic supply chain for tracking assets with the following requirements:

1. [x] The contract should allow producers to register new assets, each with a unique ID and additional details such as product type, production date, and origin.
2. [x] The contract should allow assets to be transferred from the producer to a carrier, from the carrier to a retailer, and from the retailer to a consumer.
3. [x] Each transfer should update the asset's current holder and maintain a history of all past holders.
4. [x] The contract should allow anyone to check an asset's current holder and its holder history by querying the asset's unique ID.
5. [x] The contract should prevent an asset's details from being altered once it is registered.
6. [x] Use a `struct` to define an asset with attributes like ID, product type, production date, origin, current holder, and holder history.
7. [x] Use `mapping` to link asset IDs with their respective asset data.
8. [x] Use `msg.sender` to track the current holder during asset transfers.
9. [x] Use `modifier` functions to enforce restrictions, such as preventing changes after an asset is registered.

## Warning

Please note, managing asset information on a supply chain requires considerations for privacy and security. This challenge does not cover all aspects of a real-world decentralized supply chain system.

For a comprehensive understanding of Celo smart contracts and Solidity, please refer to the Celo and Solidity tutorials.