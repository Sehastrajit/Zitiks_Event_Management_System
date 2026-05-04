import { network } from "hardhat";
import { keccak256, toUtf8Bytes } from "ethers";
import assert from "node:assert/strict";
import { describe, it, before } from "node:test";

describe("Event Ticketing System", () => {

    let eventRegistry;
    let ticketCredential;

    let organizer;
    let buyer;
    let stranger;

    let ethers;

    const fakeCredentialHash = keccak256(
        toUtf8Bytes("seat:A14,venue:Chase Center,date:2026-05-01")
    );

    const fakeEventDate = Math.floor(Date.now() / 1000) + 86400; // tomorrow

    before(async () => {
        const conn = await network.connect();
        ethers = conn.ethers;

        [organizer, buyer, stranger] = await ethers.getSigners();

        const EventRegistry = await ethers.getContractFactory("EventRegistry");
        eventRegistry = await EventRegistry.connect(organizer).deploy();
        await eventRegistry.waitForDeployment();

        const TicketCredential = await ethers.getContractFactory("TicketCredential");
        ticketCredential = await TicketCredential.connect(organizer).deploy(
            await eventRegistry.getAddress()
        );
        await ticketCredential.waitForDeployment();
    });

    // ─── EventRegistry ────────────────────────────────────────────────

    describe("EventRegistry", () => {

        it("organizer can create an event", async () => {
            const tx = await eventRegistry.connect(organizer).createEvent(
                "ASU Blockchain Summit",
                "Tempe, AZ",
                fakeEventDate,
                100
            );
            await tx.wait();

            const event = await eventRegistry["getEvent(uint256)"](0);
            assert.equal(event.name, "ASU Blockchain Summit");
            assert.equal(event.venue, "Tempe, AZ");
            assert.equal(event.ticketSupply, 100n);
            assert.equal(event.ticketsSold, 0n);
            assert.equal(event.organizer, organizer.address);
        });

        it("fails if event name is empty", async () => {
            await assert.rejects(
                eventRegistry.connect(organizer).createEvent("", "Tempe, AZ", fakeEventDate, 100),
                /Name cannot be empty/
            );
        });

        it("fails if ticket supply is zero", async () => {
            await assert.rejects(
                eventRegistry.connect(organizer).createEvent("Test", "Tempe, AZ", fakeEventDate, 0),
                /Must have at least 1 ticket/
            );
        });

        it("reports correct tickets available", async () => {
            const available = await eventRegistry.ticketsAvailable(0);
            assert.equal(available, 100n);
        });

    });

    // ─── TicketCredential ─────────────────────────────────────────────

    describe("TicketCredential", () => {

        it("organizer can issue a ticket to a buyer", async () => {
            const tx = await ticketCredential.connect(organizer).issueTicket(
                0,
                buyer.address,
                fakeCredentialHash
            );
            await tx.wait();

            const cred = await ticketCredential.getCredential(0);
            assert.equal(cred.holder, buyer.address);
            assert.equal(cred.credentialHash, fakeCredentialHash);
            assert.equal(cred.status, 0n); // 0 = Valid
        });

        it("issuing a ticket reduces available supply", async () => {
            const available = await eventRegistry.ticketsAvailable(0);
            assert.equal(available, 99n);
        });

        it("stranger cannot issue a ticket", async () => {
            await assert.rejects(
                ticketCredential.connect(stranger).issueTicket(0, buyer.address, fakeCredentialHash),
                /Only organizer can issue tickets/
            );
        });

        it("buyer can transfer ticket to stranger", async () => {
            const newHash = keccak256(
                toUtf8Bytes("seat:A14,venue:Chase Center,newHolder:stranger")
            );

            const tx = await ticketCredential.connect(buyer).transferTicket(
                0,
                stranger.address,
                newHash
            );
            await tx.wait();

            const cred = await ticketCredential.getCredential(0);
            assert.equal(cred.holder, stranger.address);
            assert.equal(cred.credentialHash, newHash);
        });

        it("original buyer can no longer transfer the ticket", async () => {
            await assert.rejects(
                ticketCredential.connect(buyer).transferTicket(0, stranger.address, fakeCredentialHash),
                /Not the ticket holder/
            );
        });

        it("organizer can revoke a ticket", async () => {
            const issueHash = keccak256(toUtf8Bytes("revoke-test-ticket"));
            const issueTx = await ticketCredential.connect(organizer).issueTicket(
                0,
                buyer.address,
                issueHash
            );
            await issueTx.wait();

            const revokeTx = await ticketCredential.connect(organizer).revokeTicket(1, 0);
            await revokeTx.wait();

            const cred = await ticketCredential.getCredential(1);
            assert.equal(cred.status, 2n); // 2 = Revoked
        });

    });

});
