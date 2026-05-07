# ZITIKS — Event & Movie Ticketing Platform

A full-stack Next.js platform for discovering and booking events and movies, with an AI chat assistant, interactive maps, Stripe payments, and blockchain-backed ticket issuance.

## Features

- **Event & Movie Browsing** — Filter by city, state, genre, type, price, and rating with live results
- **Interactive Maps** — Leaflet-powered location maps on every event detail page with distance sorting
- **AI Chat Assistant** — Groq-powered chatbot (separate instances for events and movies) that surfaces relevant cards inline with the reply
- **Stripe Payments** — Secure card checkout with payment-intent confirmation
- **Blockchain Tickets** — On-chain ERC-style credential issued on booking via a local Ethereum node
- **SMS & Email Notifications** — Twilio and Nodemailer for booking confirmations
- **Trailer Previews** — YouTube trailer auto-plays on hover for every movie card

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Maps | react-leaflet + Leaflet |
| Payments | Stripe (React Stripe.js) |
| AI / Chat | Groq API — llama-3.1-8b-instant |
| Blockchain | Ethers.js |
| Notifications | Nodemailer · Twilio |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Purpose |
|---|---|
| `GROQ_API_KEY` | Groq API key for the AI chat assistant |
| `STRIPE_SECRET_KEY` | Stripe secret key for payment intents |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (client-side) |
| `TWILIO_ACCOUNT_SID` | Twilio account SID for SMS notifications |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Twilio phone number to send from |
| `EMAIL_USER` | Gmail address for Nodemailer |
| `EMAIL_PASS` | Gmail app password for Nodemailer |

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/frontend/
├── app/
│   ├── page.tsx              # Landing page
│   ├── book/                 # Events browse + detail + booking
│   ├── movies/               # Movies browse + detail + booking
│   ├── about/                # About page
│   ├── contact/              # Contact form
│   └── api/                  # API routes (chat, movie-chat, payments, events)
├── components/
│   ├── ChatBot.tsx           # Events AI chat widget
│   ├── MovieChatBot.tsx      # Movies AI chat widget
│   ├── MapView.tsx           # Browse-page map overlay
│   └── Footer.tsx
└── lib/
    ├── events.ts             # Event data + types
    └── movies.ts             # Movie data + types
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes and open a pull request

Issues and feature requests are welcome at [github.com/Sehastrajit/Zitiks_Event_Management_System/issues](https://github.com/Sehastrajit/Zitiks_Event_Management_System/issues).

## License

MIT — see [LICENSE](LICENSE) for details.
