"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  lat: number;
  lng: number;
  title: string;
  location: string;
  city: string;
  type?: string;
};

const categoryStyles: Record<string, { bg: string; border: string; emoji: string }> = {
  Concert:    { bg: "linear-gradient(135deg, #7f1d1d, #b45309)", border: "#f5d27a", emoji: "🎵" },
  Conference: { bg: "linear-gradient(135deg, #0f172a, #1e3a8a)", border: "#93c5fd", emoji: "🎤" },
  Shows:      { bg: "linear-gradient(135deg, #2e1065, #7e22ce)", border: "#d8b4fe", emoji: "🎭" },
  Workshop:   { bg: "linear-gradient(135deg, #064e3b, #166534)", border: "#86efac", emoji: "🛠️" },
};

function createEventIcon(type: string) {
  const s = categoryStyles[type] ?? {
    bg: "linear-gradient(135deg, #262626, #525252)",
    border: "#d4d4d4",
    emoji: "📍",
  };

  return L.divIcon({
    className: "",
    iconSize: [34, 42],
    iconAnchor: [17, 40],
    popupAnchor: [0, -36],
    html: `
      <div style="position:relative;width:34px;height:42px;cursor:pointer">
        <div style="
          position:absolute;left:50%;top:4px;
          width:32px;height:32px;
          transform:translateX(-50%) rotate(45deg);
          border-radius:13px 13px 13px 3px;
          background:${s.bg};
          border:1.5px solid ${s.border};
          box-shadow:0 12px 24px rgba(0,0,0,0.38),inset 0 1px 0 rgba(255,255,255,0.22);
        "></div>
        <div style="
          position:absolute;left:50%;top:8px;
          width:26px;height:26px;
          transform:translateX(-50%);
          border-radius:9999px;
          background:rgba(255,255,255,0.12);
          border:1px solid rgba(255,255,255,0.2);
          display:flex;align-items:center;justify-content:center;
          font-size:14px;
        ">${s.emoji}</div>
        <div style="
          position:absolute;left:50%;bottom:0;
          width:7px;height:7px;
          transform:translateX(-50%);
          border-radius:9999px;
          background:${s.border};
          box-shadow:0 0 12px ${s.border};
        "></div>
      </div>
    `,
  });
}

export default function EventLocationMap({ lat, lng, title, location, city, type = "Concert" }: Props) {
  const [icon, setIcon] = useState<L.DivIcon | null>(null);

  useEffect(() => {
    setIcon(createEventIcon(type));
  }, [type]);

  if (!icon) {
    return <div className="h-full w-full animate-pulse bg-neutral-900" />;
  }

  return (
    <div className="h-full w-full">
      <style>{`
        .leaflet-container { background: #0a0a0a; font-family: inherit; }
        .leaflet-tile { filter: brightness(0.88) contrast(1.05); }
        .leaflet-popup-content-wrapper {
          border-radius: 18px;
          background: rgba(10,10,10,0.96);
          color: white;
          border: 1px solid rgba(245,210,122,0.2);
          box-shadow: 0 24px 60px rgba(0,0,0,0.65);
          backdrop-filter: blur(16px);
          overflow: hidden;
        }
        .leaflet-popup-tip { background: rgba(10,10,10,0.96); }
        .leaflet-popup-content { margin: 0; width: auto !important; }
        .leaflet-control-zoom {
          border: 1px solid rgba(245,210,122,0.18) !important;
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 12px 32px rgba(0,0,0,0.4) !important;
        }
        .leaflet-control-zoom a {
          background: rgba(10,10,10,0.88) !important;
          color: #f5d27a !important;
          border-color: rgba(245,210,122,0.14) !important;
        }
        .leaflet-control-zoom a:hover { background: rgba(245,210,122,0.12) !important; }
        .leaflet-control-attribution {
          background: rgba(10,10,10,0.7) !important;
          color: rgba(255,255,255,0.38) !important;
          font-size: 10px;
        }
        .leaflet-control-attribution a { color: rgba(245,210,122,0.6) !important; }
      `}</style>

      <MapContainer
        center={[lat, lng]}
        zoom={14}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <Marker position={[lat, lng]} icon={icon}>
          <Popup>
            <div className="px-4 py-3">
              <p className="font-semibold text-white">{title}</p>
              <p className="mt-1 text-sm text-white/55">{location}</p>
              <p className="text-sm text-white/55">{city}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
