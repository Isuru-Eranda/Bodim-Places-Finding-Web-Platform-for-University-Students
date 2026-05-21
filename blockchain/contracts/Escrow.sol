// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Escrow {
    struct Booking {
        address student;
        address owner;
        uint256 amount;
        bool released;
        bool exists;
    }

    mapping(uint256 => Booking) public bookings;

    event Created(uint256 indexed bookingId, address indexed student, address indexed owner, uint256 amount);
    event Released(uint256 indexed bookingId, address indexed owner, uint256 amount);
    event Cancelled(uint256 indexed bookingId, address indexed student, uint256 amount);

    /// @notice Student creates an escrow for a booking by sending ETH
    function createEscrow(uint256 bookingId, address owner) external payable {
        require(msg.value > 0, "No funds sent");
        require(!bookings[bookingId].exists, "Booking exists");

        bookings[bookingId] = Booking({
            student: msg.sender,
            owner: owner,
            amount: msg.value,
            released: false,
            exists: true
        });

        emit Created(bookingId, msg.sender, owner, msg.value);
    }

    /// @notice Owner confirms the stay and releases funds to owner
    function confirmStay(uint256 bookingId) external {
        Booking storage b = bookings[bookingId];
        require(b.exists, "No such booking");
        require(msg.sender == b.owner, "Only owner can confirm");
        require(!b.released, "Already released");

        b.released = true;
        uint256 amount = b.amount;
        // zero out before transfer to be safe for reentrancy
        b.amount = 0;
        (bool ok, ) = payable(b.owner).call{value: amount}("");
        require(ok, "Transfer failed");

        emit Released(bookingId, b.owner, amount);
    }

    /// @notice Student can cancel before owner confirms and get refund
    function cancel(uint256 bookingId) external {
        Booking storage b = bookings[bookingId];
        require(b.exists, "No such booking");
        require(msg.sender == b.student, "Only student can cancel");
        require(!b.released, "Already released");

        b.released = true;
        uint256 amount = b.amount;
        b.amount = 0;
        (bool ok, ) = payable(b.student).call{value: amount}("");
        require(ok, "Refund failed");

        emit Cancelled(bookingId, b.student, amount);
    }

    /// @notice View a booking
    function getBooking(uint256 bookingId) external view returns (address student, address owner, uint256 amount, bool released, bool exists) {
        Booking storage b = bookings[bookingId];
        return (b.student, b.owner, b.amount, b.released, b.exists);
    }
}
