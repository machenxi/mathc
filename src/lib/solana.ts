import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import bs58 from 'bs58'
import type { Environment } from './config.js'

export function createConnectionAndWallet(env: Environment) {
  const connection = new Connection(env.RPC_URL, { commitment: 'confirmed' })
  const secret = bs58.decode(env.KEYPAIR_BASE58)
  const wallet = Keypair.fromSecretKey(secret)
  return { connection, wallet }
}

export function toPublicKey(addr: string): PublicKey {
  return new PublicKey(addr)
}


