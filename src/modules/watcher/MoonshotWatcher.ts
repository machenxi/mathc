import { Connection } from '@solana/web3.js'
import fs from 'fs'
import path from 'path'

export type NewPoolEvent = { baseMint: string, quoteMint: string, pool: string }

export type WatcherConfig = {
  moonshotProgram?: string
  pollMs?: number
  recentPools?: string[]
}

export class MoonshotWatcher {
  private readonly connection: Connection
  private readonly logger: any
  private readonly configPath: string
  private cfg!: WatcherConfig

  constructor(args: { connection: Connection, logger: any, configPath: string }) {
    this.connection = args.connection
    this.logger = args.logger
    this.configPath = args.configPath
    this.loadCfg()
  }

  private loadCfg() {
    const resolved = path.resolve(process.cwd(), this.configPath)
    this.cfg = JSON.parse(fs.readFileSync(resolved, 'utf-8'))
  }

  async start(onNewPool: (e: NewPoolEvent) => Promise<void>) {
    const pollMs = this.cfg.pollMs ?? 3000
    this.logger.info({ pollMs }, 'watching moonshot pools')
    setInterval(async () => {
      try {
        // Placeholder: replace with program account scan / logs subscription
        // For now, feed from config.recentPools if any
        for (const pool of this.cfg.recentPools ?? []) {
          const e: NewPoolEvent = { baseMint: pool, quoteMint: 'So11111111111111111111111111111111111111112', pool }
          await onNewPool(e)
        }
      } catch (err) {
        this.logger.error({ err }, 'watcher error')
      }
    }, pollMs)
  }
}


