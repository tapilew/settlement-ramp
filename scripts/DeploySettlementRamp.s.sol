// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/src/SettlementRamp.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address chainSettleNodeAddress = vm.envAddress("CHAINSETTLE_NODE_ADDRESS");
        address chainlinkAutomationRegistry = vm.envAddress("CHAINLINK_AUTOMATION_REGISTRY");

        vm.startBroadcast(deployerPrivateKey);

        SettlementRamp settlementRamp = new SettlementRamp(
            chainSettleNodeAddress,
            chainlinkAutomationRegistry
        );

        vm.stopBroadcast();

        console.log("SettlementRamp deployed to:", address(settlementRamp));
    }
} 