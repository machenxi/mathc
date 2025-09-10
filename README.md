# Moonshot Sniper Bot

High‑speed sniper and volume bot for Moonshot on Solana. Monitors new pool creation and executes buys rapidly with optional auto‑sell, plus a volume module for cadence‑based trading. Includes Telegram alerts and a CLI.

## What is Moonshot?

Moonshot is a Solana DEX focused on ultra‑fast token launches and micro‑cap trading. It lets you trade new tokens instantly, using AMMs and Solana’s low‑latency network.

## Features

- New pool watcher (poll or logs, configurable)
- Sniper buy flow with priority confirmation
- Optional auto‑sell on target profit drawdown
- Volume bot with rate limiting
- Telegram notifications for key actions
- TypeScript, @solana/web3.js, SPL tokens

## How it works

1) Watcher detects new Moonshot pools (program scan / logs)
2) Fetch pair info → construct buy transaction
3) Optional: set priority fees and batching
4) Send → confirm → alert
5) Auto‑sell rules (profit target / stop) if enabled

## Quick Start

### Prerequisites

- Node.js >= 18.17
- Solana RPC (Helius/Triton or mainnet RPC)
- bs58‑encoded keypair secret

### Install

```bash
npm install
```

### Configure

Copy `env.example` to `.env` and fill values:

```ini
RPC_URL=https://api.mainnet-beta.solana.com
KEYPAIR_BASE58=...
LOG_LEVEL=info
TELEGRAM_BOT_TOKEN=123:ABC
TELEGRAM_CHAT_ID=123456789
```

Use example configs:

- `config.sniper.example.json`
- `config.volume.example.json`

### Run

```bash
npm run build
node dist/index.js sniper -c config.sniper.example.json --dry-run
node dist/index.js volume -c config.volume.example.json
```

## Bot Workflows

- Sniper: monitor → validate → buy → confirm → alert → optional auto‑sell
- Volume: timed loop → buy/sell with small sizes and rate limits

## Notes

- Replace placeholder `moonshotProgram` with the real program id when available.
- Integrate with actual Moonshot pool swap/route for production.

## Telegram Contact

- Contact: t.me/@lorine93s

