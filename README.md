## Introduction

Solidity is the primary language for developing smart contracts on blockchain platforms such as Celo. A common use case of blockchain technology is to build supply chain solutions, enabling transparent and immutable tracking of assets from production to delivery. This challenge involves creating a simple supply chain contract using Solidity.

## Problem Statement

Design a smart contract that facilitates a basic supply chain for tracking assets with the following requirements:

1. The contract should allow producers to register new assets, each with a unique ID and additional details such as product type, production date, and origin.
2. The contract should allow assets to be transferred from the producer to a carrier, from the carrier to a retailer, and from the retailer to a consumer.
3. Each transfer should update the asset's current holder and maintain a history of all past holders.
4. The contract should allow anyone to check an asset's current holder and its holder history by querying the asset's unique ID.
5. The contract should prevent an asset's details from being altered once it is registered.

## Hints

- Use a `struct` to define an asset with attributes like ID, product type, production date, origin, current holder, and holder history.
- Use `mapping` to link asset IDs with their respective asset data.
- Use `msg.sender` to track the current holder during asset transfers.
- Use `modifier` functions to enforce restrictions, such as preventing changes after an asset is registered.

## Evaluation Criteria

- **Correctness**: The contract should compile without errors and fulfill all the requirements.
- **Readability**: The contract should be well-documented, with comments explaining the code.
- **Testability**: You should also provide examples of how to test each function of the contract.

Please note, managing asset information on a supply chain requires considerations for privacy and security. This challenge does not cover all aspects of a real-world decentralized supply chain system.

For a comprehensive understanding of Celo smart contracts and Solidity, please refer to the Celo and Solidity tutorials.

## Submission

Please reply with a link to your PR on GitHub, including your supply chain contract. Also, include any notes or comments you think are necessary to understand your design and choices. Lastly, provide a brief explanation about how each function of the contract should be tested.
