# ZITIKS Event Management System

ZITIKS is an open-source event discovery and ticketing project built with Next.js. It includes event browsing, filtering, event details, interactive maps, and a booking flow with optional blockchain ticket issuance.

## Features

- Event browsing with search, category, date, location, and price filters
- Event detail pages with schedule timelines and location maps
- Create-event interface for organizer workflows
- Next.js API routes for event and map data
- Optional blockchain ticketing integration through `ethers`
- Responsive dark UI built with Tailwind CSS

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Leaflet and React Leaflet
- ethers.js

## Project Structure

```text
src/frontend          Next.js application
src/frontend/app      Pages and API routes
src/frontend/lib      Shared frontend data and helpers
src/backend           Legacy/backend experiments and blockchain scripts
credits.txt           Asset credits
```

The app now runs from `src/frontend`; event and map data are served through Next.js API routes.

## Getting Started

```powershell
cd src/frontend
npm install
npm.cmd run dev
```

Open:

```text
http://localhost:3000
```

## Build

```powershell
cd src/frontend
npm.cmd run build
```

## Deployment

Deploy `src/frontend` as the project root on Vercel.

Recommended Vercel settings:

```text
Root Directory: src/frontend
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
```

## Environment Variables

Blockchain booking is optional. If you want real on-chain ticket issuance, configure:

```env
EMS_RPC_URL=
EMS_EVENT_REGISTRY=
EMS_TICKET_CREDENTIAL=
EMS_ORGANIZER_KEY=
```

Without these variables, the booking API can return mock tickets for demo use.

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

Good first contributions include:

- UI polish and accessibility improvements
- Event creation workflow improvements
- Map interaction improvements
- Test coverage
- Documentation fixes

Pull requests run the frontend build through GitHub Actions.

## Security

Please report security issues privately using the instructions in [SECURITY.md](SECURITY.md).

## Credits

Asset credits are listed in [credits.txt](credits.txt).

## License

This project is licensed under the [MIT License](LICENSE).
