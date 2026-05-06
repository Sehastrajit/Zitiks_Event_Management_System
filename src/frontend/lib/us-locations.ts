export type StateEntry = { name: string; cities: string[] };

export const US_STATES: Record<string, StateEntry> = {
  AZ: { name: "Arizona",        cities: ["Phoenix", "Scottsdale", "Tempe", "Tucson", "Mesa", "Chandler"] },
  CA: { name: "California",     cities: ["Los Angeles", "San Francisco", "San Diego", "Sacramento", "Oakland", "San Jose"] },
  NY: { name: "New York",       cities: ["New York City", "Brooklyn", "Buffalo", "Rochester", "Albany", "Yonkers"] },
  TX: { name: "Texas",          cities: ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth", "El Paso"] },
  FL: { name: "Florida",        cities: ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale", "St. Petersburg"] },
  IL: { name: "Illinois",       cities: ["Chicago", "Aurora", "Naperville", "Rockford", "Springfield", "Peoria"] },
  GA: { name: "Georgia",        cities: ["Atlanta", "Augusta", "Columbus", "Savannah", "Athens", "Sandy Springs"] },
  WA: { name: "Washington",     cities: ["Seattle", "Spokane", "Tacoma", "Bellevue", "Olympia", "Kirkland"] },
  CO: { name: "Colorado",       cities: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Boulder", "Lakewood"] },
  MA: { name: "Massachusetts",  cities: ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell", "New Bedford"] },
  NV: { name: "Nevada",         cities: ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks", "Carson City"] },
  NC: { name: "North Carolina", cities: ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem", "Fayetteville"] },
  PA: { name: "Pennsylvania",   cities: ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading", "Scranton"] },
  OH: { name: "Ohio",           cities: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton"] },
  MI: { name: "Michigan",       cities: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor", "Lansing"] },
};

export const STATE_CODES = Object.keys(US_STATES).sort();

export function parseState(city: string): string {
  const parts = city.split(", ");
  return parts[parts.length - 1] ?? "";
}

export function parseCityName(city: string): string {
  return city.split(", ")[0] ?? city;
}
