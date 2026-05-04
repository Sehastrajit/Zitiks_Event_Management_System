// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EventRegistry {

    struct Event {
        uint256 id;
        string name;
        string venue;
        uint256 date;
        uint256 ticketSupply;
        uint256 ticketsSold;
        address organizer;
        bool exists;
    }

    mapping(uint256 => Event) public events;
    uint256 public eventCount;

    event EventCreated(
        uint256 indexed eventId,
        string name,
        address indexed organizer,
        uint256 ticketSupply
    );

    modifier onlyOrganizer(uint256 eventId) {
        require(events[eventId].exists, "Event does not exist");
        require(events[eventId].organizer == msg.sender, "Not the organizer");
        _;
    }

    function createEvent(
        string memory name,
        string memory venue,
        uint256 date,
        uint256 ticketSupply
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(ticketSupply > 0, "Must have at least 1 ticket");
        require(date > block.timestamp, "Date must be in the future");

        uint256 newId = eventCount;
        eventCount++;

        events[newId] = Event({
            id: newId,
            name: name,
            venue: venue,
            date: date,
            ticketSupply: ticketSupply,
            ticketsSold: 0,
            organizer: msg.sender,
            exists: true
        });

        emit EventCreated(newId, name, msg.sender, ticketSupply);
        return newId;
    }

    function getEvent(uint256 eventId) external view returns (Event memory) {
        require(events[eventId].exists, "Event does not exist");
        return events[eventId];
    }

    function ticketsAvailable(uint256 eventId) external view returns (uint256) {
        require(events[eventId].exists, "Event does not exist");
        return events[eventId].ticketSupply - events[eventId].ticketsSold;
    }

    // Called by TicketCredential when a ticket is sold
    function recordTicketSale(uint256 eventId) external {
        require(events[eventId].exists, "Event does not exist");
        require(
            events[eventId].ticketsSold < events[eventId].ticketSupply,
            "Sold out"
        );
        events[eventId].ticketsSold++;
    }
}
