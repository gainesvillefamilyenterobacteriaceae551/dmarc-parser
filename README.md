# DMARC Report Analyser

A browser-only tool for inspecting DMARC aggregate (rua) XML reports. No backend, no data leaves your machine.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![Zero backend](https://img.shields.io/badge/backend-none-green)

## Features

- **Upload** — drag-and-drop or pick multiple `.xml` and `.zip` files at once; ZIPs are decompressed in-browser (no server)
- **Summary dashboard** — total messages, pass rate with progress bar, date range, unique IPs, reporter count
- **Sending infrastructure detection** — infers sender from DKIM selectors (Google Workspace, Amazon SES, Resend, Brevo, Postmark, Mailgun, HubSpot, and more)
- **Records table** — sortable by any column, filterable by result / reporter / free-text search, paginated
- **Row colour-coding** — green for full pass, yellow for partial, red for any failure or non-`none` disposition
- **Failure detail panel** — full `auth_results` breakdown per failing record including DKIM selector, SPF scope, and applied policy

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| ZIP decompression | Native `DecompressionStream` API |
| XML parsing | Native `DOMParser` |
| Dependencies | None beyond Next.js |

## Project structure

```
src/
├── app/                        # Next.js App Router
├── components/
│   ├── ui/                     # DropZone, StatCard, Badge, Toast
│   └── features/               # Analyser, SummaryDashboard, RecordsTable, FailurePanel
└── lib/
    ├── parse.ts                # XML parser + provider/infra detection
    ├── zip.ts                  # In-browser ZIP reader
    └── types.ts                # Shared TypeScript types
```

## Privacy

All parsing happens in the browser. No XML content, IP addresses, or report data is ever sent to a server.

## License

MIT
