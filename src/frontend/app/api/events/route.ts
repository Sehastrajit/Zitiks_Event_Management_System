import { NextResponse } from "next/server";
import { events } from "@/lib/events";

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase();
  const eventType = searchParams.get("event_type")?.toLowerCase();

  let filteredEvents = events;

  if (search) {
    filteredEvents = filteredEvents.filter((event) => {
      return (
        event.title.toLowerCase().includes(search) ||
        event.location.toLowerCase().includes(search) ||
        event.city.toLowerCase().includes(search) ||
        event.type.toLowerCase().includes(search)
      );
    });
  }

  if (eventType && eventType !== "all") {
    filteredEvents = filteredEvents.filter((event) => event.type.toLowerCase() === eventType);
  }

  return NextResponse.json(filteredEvents);
}
