"use client";

import { useRouter } from "next/navigation";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type EventItem = {
  id: number;
  title: string;
  type: string;
  location: string;
  city: string;
  date: string;
  price: string;
  lat: number;
  lng: number;
  distance: number;
};

type Props = {
  events: EventItem[];
  userLocation: {
    lat: number;
    lng: number;
  };
};

const categoryStyles: Record<
  string,
  {
    bg: string;
    border: string;
    emoji: string;
    accent: string;
  }
> = {
  Concert: {
    bg: "linear-gradient(135deg, #7f1d1d, #b45309)",
    border: "#f5d27a",
    emoji: "🎵",
    accent: "#f5d27a",
  },
  Conference: {
    bg: "linear-gradient(135deg, #0f172a, #1e3a8a)",
    border: "#93c5fd",
    emoji: "🎤",
    accent: "#93c5fd",
  },
  Shows: {
    bg: "linear-gradient(135deg, #2e1065, #7e22ce)",
    border: "#d8b4fe",
    emoji: "🎭",
    accent: "#d8b4fe",
  },
  Workshop: {
    bg: "linear-gradient(135deg, #064e3b, #166534)",
    border: "#86efac",
    emoji: "🛠️",
    accent: "#86efac",
  },
};

function createEventIcon(type: string) {
  const style = categoryStyles[type] ?? {
    bg: "linear-gradient(135deg, #262626, #525252)",
    border: "#d4d4d4",
    emoji: "📍",
    accent: "#d4d4d4",
  };

  return L.divIcon({
    className: "",
    iconSize: [34, 42],
    iconAnchor: [17, 40],
    popupAnchor: [0, -36],
    html: `
      <div
        style="
          position: relative;
          width: 34px;
          height: 42px;
          cursor: pointer;
        "
      >
        <div
          style="
            position: absolute;
            left: 50%;
            top: 4px;
            width: 32px;
            height: 32px;
            transform: translateX(-50%) rotate(45deg);
            border-radius: 13px 13px 13px 3px;
            background: ${style.bg};
            border: 1.5px solid ${style.border};
            box-shadow:
              0 12px 24px rgba(0,0,0,0.38),
              inset 0 1px 0 rgba(255,255,255,0.22);
          "
        ></div>

        <div
          style="
            position: absolute;
            left: 50%;
            top: 8px;
            width: 26px;
            height: 26px;
            transform: translateX(-50%);
            border-radius: 9999px;
            background: rgba(255,255,255,0.12);
            border: 1px solid rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            backdrop-filter: blur(8px);
          "
        >
          ${style.emoji}
        </div>

        <div
          style="
            position: absolute;
            left: 50%;
            bottom: 0px;
            width: 7px;
            height: 7px;
            transform: translateX(-50%);
            border-radius: 9999px;
            background: ${style.border};
            box-shadow: 0 0 12px ${style.border};
          "
        ></div>
      </div>
    `,
  });
}

const userIcon = L.divIcon({
  className: "",
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  html: `
    <div
      style="
        position: relative;
        width: 34px;
        height: 34px;
      "
    >
      <div
        style="
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: rgba(245, 210, 122, 0.24);
          animation: luxuryPulse 2s infinite;
        "
      ></div>

      <div
        style="
          position: absolute;
          inset: 7px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #fff7dc, #d4af37);
          border: 2px solid #111111;
          box-shadow:
            0 10px 24px rgba(0,0,0,0.42),
            inset 0 1px 0 rgba(255,255,255,0.8);
        "
      ></div>
    </div>
  `,
});

export default function EventMap({ events, userLocation }: Props) {
  const router = useRouter();

  return (
    <div className="relative h-[440px] w-full overflow-hidden rounded-b-3xl bg-neutral-950">
      <style>
        {`
          @keyframes luxuryPulse {
            0% {
              transform: scale(0.75);
              opacity: 0.85;
            }
            70% {
              transform: scale(1.5);
              opacity: 0;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }

          .leaflet-container {
            background: #0a0a0a;
            font-family: Inter, system-ui, sans-serif;
          }

          .leaflet-tile {
            filter: grayscale(0.95) contrast(1.08) brightness(0.62) sepia(0.12);
          }

          .leaflet-popup-content-wrapper {
            border-radius: 20px;
            background: rgba(10, 10, 10, 0.94);
            color: white;
            border: 1px solid rgba(245, 210, 122, 0.22);
            box-shadow:
              0 24px 60px rgba(0,0,0,0.55),
              inset 0 1px 0 rgba(255,255,255,0.08);
            backdrop-filter: blur(18px);
            overflow: hidden;
          }

          .leaflet-popup-tip {
            background: rgba(10, 10, 10, 0.94);
          }

          .leaflet-popup-content {
            margin: 0;
            width: 250px !important;
          }

          .leaflet-control-zoom {
            border: 1px solid rgba(245, 210, 122, 0.18) !important;
            border-radius: 14px !important;
            overflow: hidden;
            box-shadow: 0 18px 40px rgba(0,0,0,0.35);
          }

          .leaflet-control-zoom a {
            background: rgba(10, 10, 10, 0.86) !important;
            color: #f5d27a !important;
            border-color: rgba(245, 210, 122, 0.14) !important;
          }

          .leaflet-control-zoom a:hover {
            background: rgba(245, 210, 122, 0.15) !important;
          }

          .leaflet-control-attribution {
            background: rgba(10, 10, 10, 0.72) !important;
            color: rgba(255,255,255,0.55) !important;
            font-size: 10px;
          }

          .leaflet-control-attribution a {
            color: rgba(245, 210, 122, 0.75) !important;
          }
        `}
      </style>

      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={11}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />

        {events.map((event) => {
          const style = categoryStyles[event.type] ?? categoryStyles.Concert;

          return (
            <Marker
              key={event.id}
              position={[event.lat, event.lng]}
              icon={createEventIcon(event.type)}
            >
              <Popup>
                <div
                  onClick={() => router.push(`/book/${event.id}`)}
                  className="cursor-pointer overflow-hidden"
                >
                  <div
                    className="border-b px-5 py-4"
                    style={{
                      borderColor: "rgba(245, 210, 122, 0.14)",
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className="rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
                        style={{
                          color: style.accent,
                          borderColor: `${style.accent}55`,
                          backgroundColor: `${style.accent}14`,
                        }}
                      >
                        {event.type}
                      </span>

                      <span className="text-xs text-white/50">
                        {event.date}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-semibold leading-snug text-white">
                      {event.title}
                    </h3>

                    <p className="mt-3 text-xs leading-relaxed text-white/55">
                      {event.location}
                      <br />
                      {event.city}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-sm font-semibold text-[#f5d27a]">
                        {event.price}
                      </span>

                      <span className="text-xs text-white/45">
                        {event.distance.toFixed(1)} mi away
                      </span>
                    </div>

                    <p className="mt-4 text-xs font-semibold tracking-wide text-white/80">
                      View event →
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="pointer-events-none absolute inset-0 z-[500] bg-[radial-gradient(circle_at_top,rgba(245,210,122,0.10),transparent_34%),linear-gradient(to_bottom,rgba(0,0,0,0.04),rgba(0,0,0,0.24))]" />
    </div>
  );
}