import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import type { Environment } from '../../lib/config.js'
import { Notifier } from '../../lib/notifier.js'

type NewPoolEvent = { baseMint: string, quoteMint: string, pool: string }

type Ctx = { connection: Connection, wallet: any, logger: any, env: Environment, dryRun: boolean }

export class Sniper {
  private readonly ctx: Ctx
  private readonly notifier: Notifier
  constructor(ctx: Ctx) { this.ctx = ctx; this.notifier = new Notifier(ctx.env.TELEGRAM_BOT_TOKEN, ctx.env.TELEGRAM_CHAT_ID) }

  async handleNewPool(evt: NewPoolEvent) {
    const { logger } = this.ctx
    logger.info({ evt }, 'new pool detected')
    await this.buy(evt.baseMint, '0.05')
  }

  async buy(tokenMint: string, solAmount: string) {
    const { connection, wallet, logger } = this.ctx
    await this.notifier.telegram(`🟢 Sniper: attempting buy\nToken: <code>${tokenMint}</code>\nSpend: ${solAmount} SOL`)

    // Placeholder: A real Moonshot buy would call the pool program; here we just create ATA to demonstrate tx
    const mint = new PublicKey(tokenMint)
    const ata = await getAssociatedTokenAddress(mint, wallet.publicKey)
    const ix = createAssociatedTokenAccountInstruction(wallet.publicKey, ata, wallet.publicKey, mint)
    const tx = new Transaction().add(ix)

    if (this.ctx.dryRun) {
      logger.info('DRY RUN: would send buy tx')
      return
    }

    const sig = await connection.sendTransaction(tx, [wallet], { skipPreflight: true })
    logger.info({ sig }, 'buy sent')
    await connection.confirmTransaction(sig, 'confirmed')
    await this.notifier.telegram(`✅ Buy sent\nSig: <code>${sig}</code>`)
  }
}


