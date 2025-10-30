// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract FiatBridgeUpgradeable is Initializable, UUPSUpgradeable, AccessControlUpgradeable {
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;

    struct FiatEvent { address user; address stable; uint256 amount; string reference; uint64 timestamp; }
    FiatEvent[] public events;
    event FiatAnchored(uint256 indexed id, address indexed user, address stable, uint256 amount, string reference);

    function initialize(address admin) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _setupRole(ADMIN_ROLE, admin);
    }

    function _authorizeUpgrade(address) internal override onlyRole(ADMIN_ROLE) {}

    function anchorFiatDeposit(address user, address stable, uint256 amount, string calldata reference) external onlyRole(ADMIN_ROLE) returns (uint256) {
        events.push(FiatEvent({user: user, stable: stable, amount: amount, reference: reference, timestamp: uint64(block.timestamp)}));
        uint256 id = events.length - 1;
        emit FiatAnchored(id, user, stable, amount, reference);
        return id;
    }

    function eventsCount() external view returns (uint256) { return events.length; }
}
