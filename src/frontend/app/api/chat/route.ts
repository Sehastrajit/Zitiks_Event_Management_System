import { NextResponse } from "next/server";
import { events } from "@/lib/events";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const eventSummary = events
  .map((event) => {
    return `${event.id}. ${event.title} (${event.type}) at ${event.location}, ${event.city} on ${event.date}, ${event.price}. ${event.description}`;
  })
  .join("\n");

function getGroqApiKey() {
  return (
    process.env.GROQ_API_KEY ||
    process.env.groq_api ||
    process.env["groq_api "] ||
    ""
  ).trim();
}

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { messages, pageContext } = body as {
    messages?: ChatMessage[];
    pageContext?: string;
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages are required" }, { status: 400 });
  }

  const cleanMessages = messages
    .filter((message) => {
      return (
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0
      );
    })
    .slice(-8)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 1200),
    }));

  const apiKey = getGroqApiKey();

  if (!apiKey) {
    return NextResponse.json(
      { error: "Groq API key is not configured. Add groq_api or GROQ_API_KEY to .env.local." },
      { status: 500 }
    );
  }

  const systemPrompt = `You are the ZITIKS event assistant.
Help users browse events, compare options, understand booking, and answer questions about the current page.
Be concise, practical, and friendly. Do not invent events that are not listed.

Available events:
${eventSummary}

Current page context:
${pageContext?.slice(0, 1200) || "Browse page"}`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      temperature: 0.4,
      max_tokens: 450,
      messages: [
        { role: "system", content: systemPrompt },
        ...cleanMessages,
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json(
      { error: `Groq request failed: ${errorText.slice(0, 300)}` },
      { status: 502 }
    );
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content;

  if (typeof reply !== "string" || reply.trim().length === 0) {
    return NextResponse.json({ error: "Groq returned an empty response" }, { status: 502 });
  }

  return NextResponse.json({ reply: reply.trim() });
}
