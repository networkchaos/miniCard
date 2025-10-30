// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IVault {
    function pullForSubscription(address user, address stable, uint256 amount, address to) external returns (bool);
}

contract SubscriptionManagerUpgradeable is Initializable, UUPSUpgradeable, AccessControlUpgradeable, ReentrancyGuardUpgradeable {
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;

    struct Subscription {
        address subscriber;
        address merchant;
        address stable;
        uint256 amount; // stable units
        uint64 period; // seconds
        uint64 nextDue;
        bool active;
    }

    IVault public vault;
    uint256 public nextSubscriptionId;
    mapping(uint256 => Subscription) public subscriptions;

    event SubscriptionCreated(uint256 indexed id, address indexed subscriber, address merchant, address stable, uint256 amount, uint64 period);
    event SubscriptionCharged(uint256 indexed id, address indexed merchant, uint256 amount, uint64 nextDue);
    event SubscriptionCancelled(uint256 indexed id);

    function initialize(address _vault, address admin) public initializer {
        __AccessControl_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        vault = IVault(_vault);
        _setupRole(ADMIN_ROLE, admin);
    }

    function _authorizeUpgrade(address) internal override onlyRole(ADMIN_ROLE) {}

    function createSubscription(address merchant, address stable, uint256 amount, uint64 period) external returns (uint256) {
        require(merchant != address(0), "Sub: merchant zero");
        require(amount > 0, "Sub: zero amount");
        require(period > 0, "Sub: zero period");

        uint256 id = nextSubscriptionId++;
        subscriptions[id] = Subscription({subscriber: msg.sender, merchant: merchant, stable: stable, amount: amount, period: period, nextDue: uint64(block.timestamp) + period, active: true});
        emit SubscriptionCreated(id, msg.sender, merchant, stable, amount, period);
        return id;
    }

    function attemptCharge(uint256 id) external nonReentrant returns (bool) {
        Subscription storage s = subscriptions[id];
        require(s.active, "Sub: not active");
        require(block.timestamp >= s.nextDue, "Sub: not due");

        bool ok = vault.pullForSubscription(s.subscriber, s.stable, s.amount, s.merchant);
        if (!ok) {
            s.active = false;
            emit SubscriptionCancelled(id);
            return false;
        }
        s.nextDue = uint64(block.timestamp + s.period);
        emit SubscriptionCharged(id, s.merchant, s.amount, s.nextDue);
        return true;
    }

    function cancelSubscription(uint256 id) external {
        Subscription storage s = subscriptions[id];
        require(msg.sender == s.subscriber || hasRole(ADMIN_ROLE, msg.sender), "Sub: not allowed");
        s.active = false;
        emit SubscriptionCancelled(id);
    }
}
