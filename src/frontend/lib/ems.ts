import { ethers } from "ethers";

// Minimal ABI — only the functions the website calls
const EVENT_REGISTRY_ABI = [
  "function getEvent(uint256 eventId) view returns (uint256 id, string name, string venue, uint256 date, uint256 ticketSupply, uint256 ticketsSold, address organizer, bool exists)",
  "function ticketsAvailable(uint256 eventId) view returns (uint256)",
];

const TICKET_CREDENTIAL_ABI = [
  "function issueTicket(uint256 eventId, address buyer, bytes32 credentialHash) returns (uint256)",
  "function getCredential(uint256 ticketId) view returns (uint256 ticketId, uint256 eventId, address holder, bytes32 credentialHash, uint8 status, uint256 issuedAt, bool exists)",
  "function getHolderTickets(address holder) view returns (uint256[])",
  "event TicketIssued(uint256 indexed ticketId, uint256 indexed eventId, address indexed holder, bytes32 credentialHash)",
];

export function isConfigured(): boolean {
  return !!(
    process.env.EMS_RPC_URL &&
    process.env.EMS_EVENT_REGISTRY &&
    process.env.EMS_TICKET_CREDENTIAL &&
    process.env.EMS_ORGANIZER_KEY
  );
}

function getProvider() {
  return new ethers.JsonRpcProvider(process.env.EMS_RPC_URL);
}

function getOrganizer() {
  return new ethers.Wallet(process.env.EMS_ORGANIZER_KEY!, getProvider());
}

export function getEventRegistry() {
  return new ethers.Contract(
    process.env.EMS_EVENT_REGISTRY!,
    EVENT_REGISTRY_ABI,
    getProvider()
  );
}

export function getTicketCredential() {
  // Signed by the organizer — issueTicket requires msg.sender == organizer
  return new ethers.Contract(
    process.env.EMS_TICKET_CREDENTIAL!,
    TICKET_CREDENTIAL_ABI,
    getOrganizer()
  );
}
