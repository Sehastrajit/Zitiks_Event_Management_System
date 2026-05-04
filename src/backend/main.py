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
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
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


@app.get("/api/power-lines")
def get_power_lines():
    return {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "id": "PL-TEMPE-01",
                    "risk": "low",
                    "risk_score": 22,
                    "reason": "Clear route near Tempe event corridor.",
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [-111.955, 33.421],
                        [-111.943, 33.426],
                        [-111.934, 33.4172],
                    ],
                },
            },
            {
                "type": "Feature",
                "properties": {
                    "id": "PL-PHX-02",
                    "risk": "medium",
                    "risk_score": 58,
                    "reason": "Moderate density near downtown event traffic.",
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [-112.085, 33.442],
                        [-112.074, 33.4484],
                        [-112.0718, 33.4483],
                    ],
                },
            },
            {
                "type": "Feature",
                "properties": {
                    "id": "PL-SCOTTSDALE-03",
                    "risk": "high",
                    "risk_score": 81,
                    "reason": "High event clustering and route overlap.",
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [-111.936, 33.4636],
                        [-111.9267, 33.4636],
                        [-111.9261, 33.4936],
                    ],
                },
            },
        ],
    }


@app.get("/api/events/{event_id}")
def get_event(event_id: int):
    events = load_events()

    for event in events:
        if event.get("id") == event_id:
            return event

    raise HTTPException(status_code=404, detail="Event not found")
