// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./EventRegistry.sol";

contract TicketCredential {

    EventRegistry public eventRegistry;

    enum TicketStatus { Valid, Used, Revoked, Transferred }

    struct Credential {
        uint256 ticketId;
        uint256 eventId;
        address holder;
        bytes32 credentialHash;
        TicketStatus status;
        uint256 issuedAt;
        bool exists;
    }

    mapping(uint256 => Credential) public credentials;
    mapping(address => uint256[]) public holderTickets;

    uint256 public ticketCount;

    event TicketIssued(
        uint256 indexed ticketId,
        uint256 indexed eventId,
        address indexed holder,
        bytes32 credentialHash
    );

    event TicketTransferred(
        uint256 indexed ticketId,
        address indexed from,
        address indexed to,
        bytes32 newCredentialHash
    );

    event TicketRevoked(uint256 indexed ticketId, address holder);

    modifier onlyHolder(uint256 ticketId) {
        require(credentials[ticketId].exists, "Ticket does not exist");
        require(credentials[ticketId].holder == msg.sender, "Not the ticket holder");
        _;
    }

    modifier onlyValid(uint256 ticketId) {
        require(credentials[ticketId].status == TicketStatus.Valid, "Ticket is not valid");
        _;
    }

    constructor(address eventRegistryAddress) {
        eventRegistry = EventRegistry(eventRegistryAddress);
    }

    function issueTicket(
        uint256 eventId,
        address buyer,
        bytes32 credentialHash
    ) external returns (uint256) {
        EventRegistry.Event memory evt = eventRegistry.getEvent(eventId);
        require(evt.organizer == msg.sender, "Only organizer can issue tickets");

        uint256 available = eventRegistry.ticketsAvailable(eventId);
        require(available > 0, "Event is sold out");

        uint256 newTicketId = ticketCount;
        ticketCount++;

        credentials[newTicketId] = Credential({
            ticketId: newTicketId,
            eventId: eventId,
            holder: buyer,
            credentialHash: credentialHash,
            status: TicketStatus.Valid,
            issuedAt: block.timestamp,
            exists: true
        });

        holderTickets[buyer].push(newTicketId);
        eventRegistry.recordTicketSale(eventId);

        emit TicketIssued(newTicketId, eventId, buyer, credentialHash);
        return newTicketId;
    }

    function transferTicket(
        uint256 ticketId,
        address newHolder,
        bytes32 newCredentialHash
    ) external onlyHolder(ticketId) onlyValid(ticketId) {
        require(newHolder != address(0), "Invalid address");
        require(newHolder != msg.sender, "Cannot transfer to yourself");

        address oldHolder = credentials[ticketId].holder;

        credentials[ticketId].holder = newHolder;
        credentials[ticketId].credentialHash = newCredentialHash;
        // Re-validate after recording so the new holder has a Valid ticket
        credentials[ticketId].status = TicketStatus.Valid;

        holderTickets[newHolder].push(ticketId);

        emit TicketTransferred(ticketId, oldHolder, newHolder, newCredentialHash);
    }

    function revokeTicket(uint256 ticketId, uint256 eventId) external {
        require(credentials[ticketId].exists, "Ticket does not exist");

        EventRegistry.Event memory evt = eventRegistry.getEvent(eventId);
        require(evt.organizer == msg.sender, "Only organizer can revoke");

        address holder = credentials[ticketId].holder;
        credentials[ticketId].status = TicketStatus.Revoked;

        emit TicketRevoked(ticketId, holder);
    }

    function getHolderTickets(address holder) external view returns (uint256[] memory) {
        return holderTickets[holder];
    }

    function getCredential(uint256 ticketId) external view returns (Credential memory) {
        require(credentials[ticketId].exists, "Ticket does not exist");
        return credentials[ticketId];
    }
}
