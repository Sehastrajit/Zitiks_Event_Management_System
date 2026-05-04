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
};

export default function EventLocationMap({ lat, lng, title, location, city }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Fix Leaflet default icon paths (broken in bundler environments)
    const proto = L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown };
    delete proto._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-full w-full animate-pulse bg-neutral-900" />;
  }

  return (
    <div className="h-full w-full">
      <style>{`
        .leaflet-container { background: #0a0a0a; font-family: inherit; }
        .leaflet-tile {
          filter: grayscale(0.92) contrast(1.1) brightness(0.56) sepia(0.08);
        }
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

        <Marker position={[lat, lng]}>
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
