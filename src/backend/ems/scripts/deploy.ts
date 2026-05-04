import { network } from "hardhat";

async function main() {
    const conn = await network.connect();
    const ethers = conn.ethers;

    const [deployer] = await ethers.getSigners();
    console.log("Deploying with:", deployer.address);

    const EventRegistry = await ethers.getContractFactory("EventRegistry");
    const eventRegistry = await EventRegistry.deploy();
    await eventRegistry.waitForDeployment();
    const eventRegistryAddr = await eventRegistry.getAddress();
    console.log("EventRegistry:    ", eventRegistryAddr);

    const TicketCredential = await ethers.getContractFactory("TicketCredential");
    const ticketCredential = await TicketCredential.deploy(eventRegistryAddr);
    await ticketCredential.waitForDeployment();
    const ticketCredentialAddr = await ticketCredential.getAddress();
    console.log("TicketCredential: ", ticketCredentialAddr);

    console.log("\nAdd to your frontend .env.local:");
    console.log(`EMS_RPC_URL=http://127.0.0.1:8545`);
    console.log(`EMS_EVENT_REGISTRY=${eventRegistryAddr}`);
    console.log(`EMS_TICKET_CREDENTIAL=${ticketCredentialAddr}`);
    console.log(`EMS_ORGANIZER_KEY=<paste first hardhat account private key here>`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
