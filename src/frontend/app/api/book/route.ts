import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { randomBytes } from "crypto";
import { isConfigured, getTicketCredential } from "@/lib/ems";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { eventId, name, email } = body as Record<string, unknown>;

  if (!eventId || !name || !email) {
    return NextResponse.json(
      { error: "eventId, name, and email are required" },
      { status: 400 }
    );
  }

  if (typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // If blockchain env vars are not configured, return a mock ticket
  if (!isConfigured()) {
    const ticketId = `TKT-${eventId}-${randomBytes(4).toString("hex").toUpperCase()}`;
    return NextResponse.json({
      success: true,
      ticketId,
      eventId,
      holder: email.trim(),
      issuedAt: new Date().toISOString(),
    });
  }

  try {
    // Generate a fresh wallet per booking so each holder has a unique address
    const buyerWallet = ethers.Wallet.createRandom();

    // Bind the credential hash to the buyer's identity and booking time
    const credentialHash = ethers.solidityPackedKeccak256(
      ["uint256", "string", "string", "uint256"],
      [BigInt(eventId as number), name.trim(), email.trim(), BigInt(Math.floor(Date.now() / 1000))]
    );

    const ticketCredential = getTicketCredential();

    // Calls TicketCredential.issueTicket on-chain (organizer signs the tx)
    const tx = await ticketCredential.issueTicket(
      eventId,
      buyerWallet.address,
      credentialHash
    );
    const receipt = await tx.wait();

    // Parse TicketIssued event to get the on-chain ticketId
    const iface = ticketCredential.interface;
    let onChainTicketId = BigInt(0);
    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog({ topics: log.topics as string[], data: log.data });
        if (parsed?.name === "TicketIssued") {
          onChainTicketId = parsed.args[0] as bigint;
          break;
        }
      } catch { /* skip logs from other contracts */ }
    }

    return NextResponse.json({
      success: true,
      ticketId: `TKT-${onChainTicketId}`,
      eventId,
      holder: buyerWallet.address,
      issuedAt: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Contract call failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
