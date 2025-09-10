import dotenv from 'dotenv'

dotenv.config()

export type Environment = {
  RPC_URL: string
  KEYPAIR_BASE58: string
  LOG_LEVEL: 'info' | 'debug' | 'error'
  TELEGRAM_BOT_TOKEN?: string
  TELEGRAM_CHAT_ID?: string
}

export function loadEnvironment(): Environment {
  const {
    RPC_URL,
    KEYPAIR_BASE58,
    LOG_LEVEL = 'info',
    TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID
  } = process.env

  if (!RPC_URL) throw new Error('RPC_URL is required')
  if (!KEYPAIR_BASE58) throw new Error('KEYPAIR_BASE58 is required (bs58-encoded secret)')

  return {
    RPC_URL,
    KEYPAIR_BASE58,
    LOG_LEVEL: LOG_LEVEL as Environment['LOG_LEVEL'],
    TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID
  }
}


