export const powerLines = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "PL-TEMPE-01",
        risk: "low",
        risk_score: 22,
        reason: "Clear route near Tempe event corridor.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-111.955, 33.421],
          [-111.943, 33.426],
          [-111.934, 33.4172],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "PL-PHX-02",
        risk: "medium",
        risk_score: 58,
        reason: "Moderate density near downtown event traffic.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-112.085, 33.442],
          [-112.074, 33.4484],
          [-112.0718, 33.4483],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "PL-SCOTTSDALE-03",
        risk: "high",
        risk_score: 81,
        reason: "High event clustering and route overlap.",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-111.936, 33.4636],
          [-111.9267, 33.4636],
          [-111.9261, 33.4936],
        ],
      },
    },
  ],
};
