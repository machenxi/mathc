import { Connection } from '@solana/web3.js'
import type { Environment } from '../../lib/config.js'
import { Notifier } from '../../lib/notifier.js'
import fs from 'fs'
import path from 'path'

type Ctx = { connection: Connection, wallet: any, logger: any, env: Environment, dryRun: boolean }

export class VolumeBot {
  private readonly ctx: Ctx
  private readonly notifier: Notifier
  private timer: NodeJS.Timeout | null = null
  constructor(ctx: Ctx) { this.ctx = ctx; this.notifier = new Notifier(ctx.env.TELEGRAM_BOT_TOKEN, ctx.env.TELEGRAM_CHAT_ID) }

  async run(configPath: string) {
    const cfg = this.loadCfg(configPath)
    const intervalMs = cfg.intervalMs ?? 20_000
    const token = cfg.token
    const amountSol = cfg.amountSol ?? '0.01'
    
    this.stop()
    this.timer = setInterval(async () => {
      try {
        await this.cycle(token, amountSol)
      } catch (err) {
        this.ctx.logger.error({ err }, 'volume error')
      }
    }, intervalMs)
  }

  stop() { if (this.timer) clearInterval(this.timer); this.timer = null }

  private async cycle(tokenMint: string, amountSol: string) {
    await this.notifier.telegram(`🔁 Volume cycle for ${tokenMint} amount ${amountSol} SOL`)
    // Placeholder: integrate with Moonshot pool swap when available
  }

  private loadCfg(p: string) {
    const resolved = path.resolve(process.cwd(), p)
    return JSON.parse(fs.readFileSync(resolved, 'utf-8'))
  }
}


