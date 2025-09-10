import { Command } from 'commander'
import { loadEnvironment } from './lib/config.js'
import { createLogger } from './lib/logger.js'
import { createConnectionAndWallet } from './lib/solana.js'
import { MoonshotWatcher } from './modules/watcher/MoonshotWatcher.js'
import { Sniper } from './modules/sniper/Sniper.js'
import { VolumeBot } from './modules/volume/VolumeBot.js'

const program = new Command()

program
  .name('moonshot')
  .description('Moonshot (Solana) sniper and volume bot')
  .version('0.1.0')

program
  .command('sniper')
  .description('Run sniper for new pools')
  .option('-c, --config <path>', 'Path to JSON config', 'config.sniper.example.json')
  .option('--dry-run', 'Simulate only', false)
  .action(async (opts) => {
    const env = loadEnvironment()
    const logger = createLogger(env.LOG_LEVEL)
    const { connection, wallet } = createConnectionAndWallet(env)
    const sniper = new Sniper({ connection, wallet, logger, env, dryRun: opts.dryRun })
    const watcher = new MoonshotWatcher({ connection, logger, configPath: opts.config })
    await watcher.start(async (evt) => {
      await sniper.handleNewPool(evt)
    })
  })

program
  .command('volume')
  .description('Run volume bot')
  .option('-c, --config <path>', 'Path to JSON config', 'config.volume.example.json')
  .option('--dry-run', 'Simulate only', false)
  .action(async (opts) => {
    const env = loadEnvironment()
    const logger = createLogger(env.LOG_LEVEL)
    const { connection, wallet } = createConnectionAndWallet(env)
    const vol = new VolumeBot({ connection, wallet, logger, env, dryRun: opts.dryRun })
    await vol.run(opts.config)
  })

await program.parseAsync(process.argv)


