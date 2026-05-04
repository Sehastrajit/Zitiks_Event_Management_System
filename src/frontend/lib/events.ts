export type EventItem = {
  id: number;
  title: string;
  type: string;
  location: string;
  city: string;
  date: string;
  price: string;
  lat: number;
  lng: number;
  description?: string;
};

export const events: EventItem[] = [
  {
    id: 1,
    title: "Desert Night Concert",
    type: "Concert",
    location: "Tempe Beach Park",
    city: "Tempe, AZ",
    date: "May 12",
    price: "$35",
    lat: 33.4308,
    lng: -111.94,
    description: "An outdoor music night with live performances, food stalls, and a premium desert atmosphere.",
  },
  {
    id: 2,
    title: "AI Builders Conference",
    type: "Conference",
    location: "ASU Memorial Union",
    city: "Tempe, AZ",
    date: "May 18",
    price: "$20",
    lat: 33.4172,
    lng: -111.9341,
    description: "A conference for students, founders, and developers interested in AI, startups, and modern software.",
  },
  {
    id: 3,
    title: "Comedy Live Show",
    type: "Shows",
    location: "Downtown Phoenix",
    city: "Phoenix, AZ",
    date: "May 22",
    price: "$25",
    lat: 33.4484,
    lng: -112.074,
    description: "A live comedy show featuring local performers and a relaxed evening crowd.",
  },
  {
    id: 4,
    title: "Startup Workshop",
    type: "Workshop",
    location: "Skysong Innovation Center",
    city: "Scottsdale, AZ",
    date: "May 25",
    price: "Free",
    lat: 33.4636,
    lng: -111.9267,
    description: "A practical workshop for early-stage builders covering product ideas, pitching, and MVP planning.",
  },
  {
    id: 5,
    title: "Luxury Jazz Evening",
    type: "Concert",
    location: "Scottsdale Center",
    city: "Scottsdale, AZ",
    date: "June 2",
    price: "$45",
    lat: 33.4936,
    lng: -111.9261,
    description: "A premium jazz night with elegant seating, live musicians, and a refined lounge atmosphere.",
  },
  {
    id: 6,
    title: "Tech Leadership Summit",
    type: "Conference",
    location: "Phoenix Convention Center",
    city: "Phoenix, AZ",
    date: "June 8",
    price: "$60",
    lat: 33.4483,
    lng: -112.0718,
    description: "A professional summit for technology leaders, builders, founders, and industry speakers.",
  },
];
