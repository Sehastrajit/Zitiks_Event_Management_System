"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);

const GeoJSON = dynamic(
  () => import("react-leaflet").then((m) => m.GeoJSON),
  { ssr: false }
);

export default function MapPage() {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/power-lines")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error(err));
  }, []);

  const lineStyle = (feature: any) => {
    const risk = feature.properties.risk;

    if (risk === "high") return { color: "red", weight: 6 };
    if (risk === "medium") return { color: "orange", weight: 6 };

    return { color: "green", weight: 6 };
  };

  const onEachFeature = (feature: any, layer: any) => {
    layer.bindPopup(`
      <b>${feature.properties.id}</b><br/>
      Risk: ${feature.properties.risk}<br/>
      Score: ${feature.properties.risk_score}<br/>
      ${feature.properties.reason}
    `);
  };

  return (
    <main className="h-screen w-full">
      <MapContainer
        center={[33.4484, -112.074]}
        zoom={11}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geoData && (
          <GeoJSON
            data={geoData}
            style={lineStyle}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </main>
  );
}
