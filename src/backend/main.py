from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json

app = FastAPI(title="Events API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EVENTS_FILE = Path(__file__).parent / "events.json"


def load_events():
    if not EVENTS_FILE.exists():
        raise HTTPException(
            status_code=500,
            detail=f"events.json not found at {EVENTS_FILE}",
        )

    try:
        with open(EVENTS_FILE, "r", encoding="utf-8") as file:
            return json.load(file)
    except json.JSONDecodeError as error:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid events.json format: {str(error)}",
        )


@app.get("/")
def root():
    return {
        "message": "Events API is running",
        "events": "/api/events",
        "docs": "/docs",
    }


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/events")
def get_events(
    search: str | None = Query(default=None),
    event_type: str | None = Query(default=None),
):
    events = load_events()

    if search:
        search_lower = search.lower()
        events = [
            event
            for event in events
            if search_lower in event.get("title", "").lower()
            or search_lower in event.get("location", "").lower()
            or search_lower in event.get("city", "").lower()
            or search_lower in event.get("type", "").lower()
        ]

    if event_type and event_type.lower() != "all":
        events = [
            event
            for event in events
            if event.get("type", "").lower() == event_type.lower()
        ]

    return events


@app.get("/api/events/{event_id}")
def get_event(event_id: int):
    events = load_events()

    for event in events:
        if event.get("id") == event_id:
            return event

    raise HTTPException(status_code=404, detail="Event not found")