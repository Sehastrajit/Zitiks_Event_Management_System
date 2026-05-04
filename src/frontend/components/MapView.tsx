"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView() {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/power-lines")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Failed to load power lines:", err));
  }, []);

  const getLineStyle = (feature: any) => {
    const risk = feature.properties.risk;

    if (risk === "high") {
      return { color: "red", weight: 6 };
    }

    if (risk === "medium") {
      return { color: "orange", weight: 6 };
    }

    return { color: "green", weight: 6 };
  };

  const onEachFeature = (feature: any, layer: any) => {
    layer.bindPopup(`
      <strong>${feature.properties.id}</strong><br/>
      Risk: ${feature.properties.risk}<br/>
      Score: ${feature.properties.risk_score}<br/>
      Reason: ${feature.properties.reason}
    `);
  };

  return (
    <div className="h-screen w-full">
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
            style={getLineStyle}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
}